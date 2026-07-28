const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient();

const { pipelineQueue } = require('../utils/queue');

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

    // 1. Get the repository (attached by verifyGithubWebhook middleware)
    const repo = req.repo;

    // 2. Create a new PipelineRun
    let pipelineRun;
    try {
      pipelineRun = await prisma.pipelineRun.create({
        data: {
          repoId: repo.id,
          commitMsg: headCommit.message.split('\n')[0].substring(0, 255), // Use first line of commit
          commitSha: headCommit.id,
          branch: branch,
          status: 'QUEUED',
          trigger: 'webhook',
        },
      });
    } catch (e) {
      // Idempotency: Ignore duplicate webhooks for the same push
      if (e.code === 'P2002') {
        logger.info(`Pipeline already queued for ${repoFullName} commit ${headCommit.id}`);
        return res.status(200).json({ message: 'Pipeline already queued' });
      }
      throw e;
    }

    logger.info(`Pipeline ${pipelineRun.id} queued for ${repoFullName} in database`);

    // 3. Enqueue the pipeline job in BullMQ
    await pipelineQueue.add('run-pipeline', {
      pipelineId: pipelineRun.id,
      repoUrl: repo.url,
      commitSha: headCommit.id,
    });

    logger.info(`Pipeline ${pipelineRun.id} added to BullMQ for execution`);

    return res.status(202).json({
      message: 'Pipeline queued successfully',
      pipelineId: pipelineRun.id,
    });
  } catch (error) {
    logger.error('Error handling GitHub webhook', { error: error.message });
    next(error);
  }
};

module.exports = {
  handleGithubPush,
};
