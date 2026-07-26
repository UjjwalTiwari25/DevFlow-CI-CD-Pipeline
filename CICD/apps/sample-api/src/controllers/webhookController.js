const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const crypto = require('crypto');

const prisma = new PrismaClient();

const handleGithubPush = async (req, res, next) => {
  try {
    const event = req.headers['x-github-event'];
    
    // We only care about push events for CI/CD
    if (event !== 'push') {
      return res.status(200).json({ message: 'Event ignored' });
    }

    const payload = req.body;
    
    // Extract key details from the GitHub webhook payload
    const repoFullName = payload.repository.full_name;
    const branch = payload.ref.replace('refs/heads/', '');
    const headCommit = payload.head_commit;

    if (!headCommit) {
      return res.status(200).json({ message: 'No head commit found, ignoring' });
    }

    // 1. Find the registered repository in our database
    const repo = await prisma.repository.findFirst({
      where: { fullName: repoFullName, isActive: true },
    });

    if (!repo) {
      logger.warn(`Webhook received for unregistered repository: ${repoFullName}`);
      return res.status(404).json({ error: 'Repository not registered in DevFlow' });
    }

    // 2. Create a new PipelineRun
    const pipelineRun = await prisma.pipelineRun.create({
      data: {
        repoId: repo.id,
        commitMsg: headCommit.message.split('\n')[0].substring(0, 255), // Use first line of commit
        commitSha: headCommit.id,
        branch: branch,
        status: 'QUEUED',
        trigger: 'webhook',
      }
    });

    logger.info(`Pipeline ${pipelineRun.id} queued for ${repoFullName}`);

    // 3. (Optional Track B Async task) Simulate pipeline execution
    // In a real app, this would push an event to a queue (e.g. Redis/BullMQ).
    // For DevFlow, we will simulate the pipeline run asynchronously.
    simulatePipelineExecution(pipelineRun.id);

    return res.status(202).json({
      message: 'Pipeline queued successfully',
      pipelineId: pipelineRun.id
    });
  } catch (error) {
    logger.error('Error handling GitHub webhook', { error: error.message });
    next(error);
  }
};

// Simulated CI Worker
async function simulatePipelineExecution(pipelineId) {
  try {
    // 1. Mark as running
    await prisma.pipelineRun.update({
      where: { id: pipelineId },
      data: { status: 'RUNNING' }
    });
    
    // 2. Simulate build time (e.g., 3-8 seconds)
    const durationMs = Math.floor(Math.random() * 5000) + 3000;
    await new Promise(resolve => setTimeout(resolve, durationMs));

    // 3. Determine outcome (mostly success)
    const isSuccess = Math.random() > 0.1;
    
    await prisma.pipelineRun.update({
      where: { id: pipelineId },
      data: { 
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        finishedAt: new Date(),
        duration: Math.floor(durationMs / 1000),
        lintPassed: true,
        testsPassed: isSuccess,
        testCoverage: isSuccess ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 40,
        buildPassed: isSuccess,
        logsUrl: 'https://logs.devflow.ai/simulated'
      }
    });
    
    logger.info(`Simulated pipeline ${pipelineId} completed with status: ${isSuccess ? 'SUCCESS' : 'FAILED'}`);
  } catch (error) {
    logger.error(`Simulated pipeline ${pipelineId} crashed`, { error: error.message });
  }
}

module.exports = {
  handleGithubPush
};
