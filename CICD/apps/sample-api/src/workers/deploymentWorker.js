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

const COMMIT_SHA_REGEX = /^[a-f0-9]{40}$/;
const REPO_URL_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;

function validateInputs(repoUrl, commitSha) {
  if (!COMMIT_SHA_REGEX.test(commitSha)) {
    throw new Error(`Invalid commit SHA: must be 40 hex characters, got "${String(commitSha).substring(0, 50)}"`);
  }
  if (!REPO_URL_REGEX.test(repoUrl)) {
    throw new Error(`Invalid repository URL: must be a GitHub HTTPS URL, got "${String(repoUrl).substring(0, 100)}"`);
  }
}

const deploymentWorker = new Worker(
  'deployment-queue',
  async (job) => {
    const { deploymentId, repoUrl, commitSha } = job.data;
    
    try {
      validateInputs(repoUrl, commitSha);

      const deployment = await prisma.deployment.findUnique({
        where: { id: deploymentId },
        include: { repository: { include: { owner: true } } }
      });
      const userId = deployment.repository.ownerId;

      await prisma.deployment.update({
        where: { id: deploymentId },
        data: { status: 'DEPLOYING' },
      });
      publishEvent(userId, 'deployment_updated', { deploymentId });

      const workDir = path.join(os.tmpdir(), `deployment-${deploymentId}`);
      fs.mkdirSync(workDir, { recursive: true });

      const cdCmd = `PKG=$(find . -name "package.json" -not -path "*/node_modules/*" | head -n 1); [ -n "$PKG" ] && cd "$(dirname "$PKG")"`;
      
      const stages = [
        { name: 'Checkout', cmd: `git clone "${repoUrl}.git" . && git checkout "${commitSha}"` },
        { name: 'Install', cmd: `${cdCmd}; npm install` },
        { name: 'Build', cmd: `${cdCmd}; npm run build --if-present` },
      ];

      let deployPassed = true;
      for (const stage of stages) {
        if (!deployPassed) break;
        
        let exitCode = 0;
        try {
          exitCode = await new Promise((resolve) => {
            const child = spawn('sh', ['-c', stage.cmd], { cwd: workDir });
            child.on('close', code => resolve(code));
            child.on('error', () => resolve(1));
          });
        } catch (e) {
          exitCode = 1;
        }
        
        if (exitCode !== 0) deployPassed = false;
      }

      fs.rmSync(workDir, { recursive: true, force: true });

      const fakeUrl = `https://${deployment.repository.name}-live.devflow.app`;

      if (deployPassed) {
        // Mark previous LIVE deployments for this repo as INACTIVE or similar (optional, but good practice).
        // For simplicity, we just mark this one as LIVE.
        await prisma.deployment.update({
          where: { id: deploymentId },
          data: {
            status: 'LIVE',
            url: fakeUrl,
          },
        });
      } else {
        await prisma.deployment.update({
          where: { id: deploymentId },
          data: { status: 'FAILED' },
        });
      }

      publishEvent(userId, 'deployment_updated', { deploymentId });
      logger.info(`Deployment ${deploymentId} finished locally with status ${deployPassed ? 'LIVE' : 'FAILED'}`);

    } catch (err) {
      logger.error(`Deployment ${job.data.deploymentId} crashed`, { error: err.message });
      await prisma.deployment.update({
        where: { id: job.data.deploymentId },
        data: { status: 'FAILED' },
      });
      const d = await prisma.deployment.findUnique({ where: { id: job.data.deploymentId }, include: { repository: true } });
      if (d) {
        publishEvent(d.repository.ownerId, 'deployment_updated', { deploymentId: d.id });
      }
    }
  },
  { 
    connection,
    stalledInterval: 30000
  }
);

deploymentWorker.on('failed', async (job, err) => {
  logger.error(`Deployment Job ${job?.id} has failed with ${err.message}`);
  if (job && job.data && job.data.deploymentId) {
    try {
      await prisma.deployment.updateMany({
        where: { id: job.data.deploymentId, status: 'DEPLOYING' },
        data: { status: 'FAILED' }
      });
      const d = await prisma.deployment.findUnique({ where: { id: job.data.deploymentId }, include: { repository: true } });
      if (d) publishEvent(d.repository.ownerId, 'deployment_updated', { deploymentId: d.id });
    } catch (e) {
      logger.error('Failed to update DB on deployment job failure', e);
    }
  }
});

module.exports = { deploymentWorker };
