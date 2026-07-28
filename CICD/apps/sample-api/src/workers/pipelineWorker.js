const { Worker } = require('bullmq');
const { connection } = require('../utils/queue');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const { publishEvent } = require('../utils/pubsub');

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
        include: { repository: true }
      });
      const userId = pipelineRun.repository.ownerId;

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: { status: 'RUNNING' },
      });
      publishEvent(userId, 'pipeline_updated', { pipelineId });

      const setupStep = await prisma.pipelineStep.create({
        data: {
          name: 'Setup Container',
          status: 'RUNNING',
          pipelineRunId: pipelineId,
        }
      });

      let setupLogs = 'Pulling node:24-alpine image...\n';
      try {
        await new Promise((resolve, reject) => {
          docker.pull('node:24-alpine', (err, stream) => {
            if (err) return reject(err);
            docker.modem.followProgress(stream, (err, res) => (err ? reject(err) : resolve(res)));
          });
        });
        setupLogs += 'Image pulled successfully.\n';
      } catch (err) {
        setupLogs += `Error pulling image: ${err.message}\n`;
        await prisma.pipelineStep.update({
          where: { id: setupStep.id },
          data: { status: 'FAILED', finishedAt: new Date(), logChunk: setupLogs }
        });
        throw err;
      }

      setupLogs += 'Creating isolated build container...\n';
      const container = await docker.createContainer({
        Image: 'node:24-alpine',
        Cmd: ['tail', '-f', '/dev/null'], // Keep container alive
        Tty: false,
        Env: [`REPO_URL=${repoUrl}`, `COMMIT_SHA=${commitSha}`],
        HostConfig: {
          Memory: 512 * 1024 * 1024,
          MemorySwap: 512 * 1024 * 1024,
          CpuPeriod: 100000,
          CpuQuota: 50000,
          PidsLimit: 256,
          ReadonlyRootfs: false,
          NetworkMode: 'bridge', // Need network for git clone and npm install
          SecurityOpt: ['no-new-privileges'],
          AutoRemove: false,
        },
      });

      await container.start();
      setupLogs += 'Container started.\n';
      await prisma.pipelineStep.update({
        where: { id: setupStep.id },
        data: { status: 'SUCCESS', finishedAt: new Date(), logChunk: setupLogs }
      });

      const stages = [
        { name: 'Checkout', cmd: `apk add --no-cache git && git clone "$REPO_URL.git" /app && cd /app && git checkout "$COMMIT_SHA"` },
        { name: 'Install', cmd: `cd /app && if [ -d "frontend" ]; then cd frontend; fi && npm install` },
        { name: 'Lint', cmd: `cd /app && if [ -d "frontend" ]; then cd frontend; fi && npm run lint --if-present` },
        { name: 'Test', cmd: `cd /app && if [ -d "frontend" ]; then cd frontend; fi && npm run test --if-present` },
        { name: 'Build', cmd: `cd /app && if [ -d "frontend" ]; then cd frontend; fi && npm run build --if-present` },
      ];

      let buildPassed = true;

      for (const stage of stages) {
        if (!buildPassed) break; // Skip remaining steps if one fails

        const stepRecord = await prisma.pipelineStep.create({
          data: {
            name: stage.name,
            status: 'RUNNING',
            pipelineRunId: pipelineId,
          }
        });

        const exec = await container.exec({
          Cmd: ['sh', '-c', stage.cmd],
          AttachStdout: true,
          AttachStderr: true,
        });

        const stream = await exec.start({ detach: false });
        let stepLogs = '';

        stream.on('data', (chunk) => {
          stepLogs += chunk.toString('utf8').substring(8);
        });

        await new Promise((resolve) => {
          stream.on('end', resolve);
        });

        const inspect = await exec.inspect();
        const exitCode = inspect.ExitCode;

        if (exitCode !== 0) {
          buildPassed = false;
        }

        await prisma.pipelineStep.update({
          where: { id: stepRecord.id },
          data: {
            status: exitCode === 0 ? 'SUCCESS' : 'FAILED',
            finishedAt: new Date(),
            exitCode: exitCode,
            logChunk: stepLogs,
          }
        });
      }

      await container.remove({ force: true });

      const durationMs = Date.now() - startTime;

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: {
          status: buildPassed ? 'SUCCESS' : 'FAILED',
          finishedAt: new Date(),
          duration: Math.floor(durationMs / 1000),
          lintPassed: buildPassed, // We can remove these later, keeping them for backward compatibility
          testsPassed: buildPassed,
          buildPassed: buildPassed,
        },
      });
      publishEvent(userId, 'pipeline_updated', { pipelineId });

      logger.info(
        `Pipeline ${pipelineId} finished inside Docker with status ${buildPassed ? 'SUCCESS' : 'FAILED'}`
      );
    } catch (err) {
      logger.error(`Docker pipeline ${pipelineId} crashed`, { error: err.message });

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          duration: Math.floor((Date.now() - startTime) / 1000),
        },
      });
      
      const p = await prisma.pipelineRun.findUnique({ where: { id: pipelineId }, include: { repository: true } });
      if (p) publishEvent(p.repository.ownerId, 'pipeline_updated', { pipelineId });
    }
  },
  { 
    connection,
    stalledInterval: 30000 // Check for stalled jobs every 30s
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
