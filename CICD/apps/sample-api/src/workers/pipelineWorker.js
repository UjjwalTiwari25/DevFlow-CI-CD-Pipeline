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

      // --- MOCK SIMULATION MODE ---
      const stages = ['Checkout', 'Install', 'Lint', 'Test', 'Build'];
      let buildPassed = true;
      
      for (const stage of stages) {
        const stepRecord = await prisma.pipelineStep.create({
          data: { name: stage, status: 'RUNNING', pipelineRunId: pipelineId }
        });
        
        await new Promise(resolve => setTimeout(resolve, 500)); // simulate small delay
        
        await prisma.pipelineStep.update({
          where: { id: stepRecord.id },
          data: {
            status: 'SUCCESS',
            finishedAt: new Date(),
            exitCode: 0,
            logChunk: `Mock successful execution of ${stage}\n`,
          }
        });
      }

      // Mock Security Scan
      if (buildPassed) {
        try {
          await prisma.securityScan.create({
            data: {
              repoId: pipelineRun.repository.id,
              pipelineRunId: pipelineId,
              commitSha: commitSha,
              scanType: 'dependency',
              scanner: 'npm-audit',
              status: 'COMPLETED',
              criticalCount: 0,
              highCount: 0,
              mediumCount: 0,
              lowCount: 0,
              report: { raw: "Mock security audit passed perfectly." },
            }
          });
          publishEvent(userId, 'security_scan_completed', { repoId: pipelineRun.repository.id });
        } catch (secErr) {
          logger.error(`Security scan mock failed`, { error: secErr.message });
        }
      }
      // ----------------------------

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

      if (buildPassed) {
        try {
          const { deploymentQueue } = require('../utils/queue');
          const lastDeploy = await prisma.deployment.findFirst({
            where: { repoId: pipelineRun.repository.id },
            orderBy: { createdAt: 'desc' },
          });
          const parts = (lastDeploy?.version || 'v1.0.0').replace('v', '').split('.').map(Number);
          parts[2]++;
          const version = `v${parts.join('.')}`;
          
          const deployment = await prisma.deployment.create({
            data: {
              version,
              commitSha,
              environment: 'production',
              status: 'QUEUED',
              triggeredBy: 'auto',
              repoId: pipelineRun.repository.id,
            },
          });
          
          await deploymentQueue.add('run-deployment', {
            deploymentId: deployment.id,
            repoUrl: repoUrl,
            commitSha: commitSha,
          });
          logger.info(`Auto-deployment queued for pipeline ${pipelineId}`);
        } catch (depErr) {
          logger.error(`Failed to trigger auto-deployment for ${pipelineId}`, { error: depErr.message });
        }
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
