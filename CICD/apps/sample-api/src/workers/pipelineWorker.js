const { Worker } = require('bullmq');
const { connection } = require('../utils/queue');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const prisma = new PrismaClient();
const { publishEvent } = require('../utils/pubsub');
const { reportCommitStatus } = require('../utils/github');
const { config } = require('../config');

// ─── Input Validation ────────────────────────────────────────────────────────
const COMMIT_SHA_REGEX = /^[a-f0-9]{40}$/;
const REPO_URL_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;

function validatePipelineInputs(repoUrl, commitSha) {
  if (!COMMIT_SHA_REGEX.test(commitSha)) {
    throw new Error(`Invalid commit SHA: must be 40 hex characters, got "${String(commitSha).substring(0, 50)}"`);
  }
  if (!REPO_URL_REGEX.test(repoUrl)) {
    throw new Error(`Invalid repository URL: must be a GitHub HTTPS URL, got "${String(repoUrl).substring(0, 100)}"`);
  }
}

const pipelineWorker = new Worker(
  'pipeline-queue',
  async (job) => {
    const { pipelineId, repoUrl, commitSha } = job.data;
    const startTime = Date.now();

    try {
      validatePipelineInputs(repoUrl, commitSha);

      const pipelineRun = await prisma.pipelineRun.findUnique({
        where: { id: pipelineId },
        include: { repository: { include: { owner: true } } }
      });
      const userId = pipelineRun.repository.ownerId;

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: { status: 'RUNNING' },
      });
      publishEvent(userId, 'pipeline_updated', { pipelineId });
      
      if (pipelineRun.repository.owner?.githubAccessToken) {
        await reportCommitStatus(
          pipelineRun.repository.owner.githubAccessToken,
          pipelineRun.repository.fullName,
          commitSha,
          'pending',
          'Pipeline is currently running',
          `${config.FRONTEND_URL}/dashboard/pipelines/${pipelineId}`
        );
      }

      const workDir = path.join(os.tmpdir(), `pipeline-${pipelineId}`);
      const setupStep = await prisma.pipelineStep.create({
        data: { name: 'Setup Runner', status: 'RUNNING', pipelineRunId: pipelineId }
      });
      
      let setupLogs = 'Setting up local workspace...\n';
      try {
        fs.mkdirSync(workDir, { recursive: true });
        setupLogs += `Workspace created at ${workDir}\n`;
        await prisma.pipelineStep.update({
          where: { id: setupStep.id },
          data: { status: 'SUCCESS', finishedAt: new Date(), logChunk: setupLogs }
        });
      } catch (err) {
        setupLogs += `Error creating workspace: ${err.message}\n`;
        await prisma.pipelineStep.update({
          where: { id: setupStep.id },
          data: { status: 'FAILED', finishedAt: new Date(), logChunk: setupLogs }
        });
        throw err;
      }

      const stages = [
        { name: 'Checkout', cmd: `git clone "${repoUrl}.git" . && git checkout "${commitSha}"` },
        { name: 'Install', cmd: `if [ -d "frontend" ]; then cd frontend && npm install; else npm install; fi` },
        { name: 'Lint', cmd: `if [ -d "frontend" ]; then cd frontend && npm run lint --if-present; else npm run lint --if-present; fi` },
        { name: 'Test', cmd: `if [ -d "frontend" ]; then cd frontend && npm run test --if-present; else npm run test --if-present; fi` },
        { name: 'Build', cmd: `if [ -d "frontend" ]; then cd frontend && npm run build --if-present; else npm run build --if-present; fi` },
      ];

      let buildPassed = true;
      for (const stage of stages) {
        if (!buildPassed) break;
        
        const stepRecord = await prisma.pipelineStep.create({
          data: { name: stage.name, status: 'RUNNING', pipelineRunId: pipelineId }
        });

        let stepLogs = '';
        let exitCode = 0;
        
        try {
          exitCode = await new Promise((resolve) => {
            const child = spawn('sh', ['-c', stage.cmd], { cwd: workDir });
            child.stdout.on('data', data => { stepLogs += data.toString(); });
            child.stderr.on('data', data => { stepLogs += data.toString(); });
            child.on('close', code => resolve(code));
            child.on('error', err => { stepLogs += `\nError: ${err.message}`; resolve(1); });
          });
        } catch (e) {
          logger.error(`Error in stage ${stage.name}`, { error: e.message });
          stepLogs += `\nException: ${e.message}`;
          exitCode = 1;
        }
        
        if (exitCode !== 0) buildPassed = false;
        
        await prisma.pipelineStep.update({
          where: { id: stepRecord.id },
          data: {
            status: exitCode === 0 ? 'SUCCESS' : 'FAILED',
            finishedAt: new Date(),
            exitCode,
            logChunk: stepLogs,
          }
        });
      }

      // Clean up
      fs.rmSync(workDir, { recursive: true, force: true });

      // Run Security Scan after Build if successful
      if (buildPassed) {
        try {
          const scanDir = path.join(os.tmpdir(), `security-${pipelineId}`);
          fs.mkdirSync(scanDir, { recursive: true });
          await new Promise(resolve => {
            const child = spawn('sh', ['-c', `git clone "${repoUrl}.git" . && git checkout "${commitSha}"`], { cwd: scanDir });
            child.on('close', resolve);
          });
          
          let auditJson = '';
          const auditExitCode = await new Promise(resolve => {
            const cmd = `if [ -d "frontend" ]; then cd frontend && npm audit --json || true; else npm audit --json || true; fi`;
            const child = spawn('sh', ['-c', cmd], { cwd: scanDir });
            child.stdout.on('data', data => { auditJson += data.toString(); });
            child.on('close', code => resolve(code));
          });
          fs.rmSync(scanDir, { recursive: true, force: true });

          let parsedAudit = null;
          try { parsedAudit = JSON.parse(auditJson); } catch(e) {}

          const vulns = parsedAudit?.metadata?.vulnerabilities || { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
          
          await prisma.securityScan.create({
            data: {
              repoId: pipelineRun.repository.id,
              pipelineRunId: pipelineId,
              commitSha: commitSha,
              scanType: 'dependency',
              scanner: 'npm-audit',
              status: 'COMPLETED',
              criticalCount: vulns.critical || 0,
              highCount: vulns.high || 0,
              mediumCount: vulns.moderate || 0,
              lowCount: vulns.low || 0,
              report: parsedAudit || { raw: auditJson },
            }
          });
          publishEvent(userId, 'security_scan_completed', { repoId: pipelineRun.repository.id });
        } catch (secErr) {
          logger.error(`Security scan failed for pipeline ${pipelineId}`, { error: secErr.message });
        }
      }

      const durationMs = Date.now() - startTime;
      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: {
          status: buildPassed ? 'SUCCESS' : 'FAILED',
          finishedAt: new Date(),
          duration: Math.floor(durationMs / 1000),
          lintPassed: buildPassed, // backward compatibility
          testsPassed: buildPassed,
          buildPassed: buildPassed,
        },
      });
      publishEvent(userId, 'pipeline_updated', { pipelineId });

      if (pipelineRun.repository.owner?.githubAccessToken) {
        await reportCommitStatus(
          pipelineRun.repository.owner.githubAccessToken,
          pipelineRun.repository.fullName,
          commitSha,
          buildPassed ? 'success' : 'failure',
          buildPassed ? 'Pipeline completed successfully' : 'Pipeline failed',
          `${config.FRONTEND_URL}/dashboard/pipelines/${pipelineId}`
        );
      }

      logger.info(`Pipeline ${pipelineId} finished locally with status ${buildPassed ? 'SUCCESS' : 'FAILED'}`);
    } catch (err) {
      logger.error(`Pipeline ${pipelineId} crashed`, { error: err.message });

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          duration: Math.floor((Date.now() - startTime) / 1000),
        },
      });
      
      const p = await prisma.pipelineRun.findUnique({ where: { id: pipelineId }, include: { repository: { include: { owner: true } } } });
      if (p) {
        publishEvent(p.repository.ownerId, 'pipeline_updated', { pipelineId });
        if (p.repository.owner?.githubAccessToken) {
          await reportCommitStatus(
            p.repository.owner.githubAccessToken,
            p.repository.fullName,
            commitSha,
            'error',
            'Pipeline crashed',
            `${config.FRONTEND_URL}/dashboard/pipelines/${pipelineId}`
          );
        }
      }
    }
  },
  { 
    connection,
    stalledInterval: 30000
  }
);

pipelineWorker.on('stalled', (jobId) => {
  logger.warn(`Job ${jobId} has stalled and will be re-processed or failed by BullMQ`);
});

pipelineWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} has completed!`);
});

pipelineWorker.on('failed', async (job, err) => {
  logger.error(`Job ${job?.id} has failed with ${err.message}`);
  if (job && job.data && job.data.pipelineId) {
    try {
      await prisma.pipelineRun.updateMany({
        where: { id: job.data.pipelineId, status: 'RUNNING' },
        data: { status: 'FAILED', finishedAt: new Date() }
      });
      const p = await prisma.pipelineRun.findUnique({ where: { id: job.data.pipelineId }, include: { repository: true } });
      if (p) publishEvent(p.repository.ownerId, 'pipeline_updated', { pipelineId: p.id });
    } catch (e) {
      logger.error('Failed to update DB on job failure', e);
    }
  }
});

module.exports = { pipelineWorker };
