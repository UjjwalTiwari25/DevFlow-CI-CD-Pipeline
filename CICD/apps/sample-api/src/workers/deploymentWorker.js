const { queueEmitter } = require('../utils/queue');
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

const deploymentProcessor = async (job) => {
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

      // --- MOCK SIMULATION MODE ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      const deployPassed = true;
      // ----------------------------

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
  };

queueEmitter.on('deployment-job', (job) => {
  deploymentProcessor(job).catch(err => {
    logger.error('Deployment job completely failed', err);
  });
});

module.exports = { deploymentWorker: null };
