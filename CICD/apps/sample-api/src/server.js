const app = require('./app');
const { config } = require('./config');
const { logger } = require('./utils/logger');
const { disconnectDB } = require('./models/prisma');
require('./workers/pipelineWorker');
require('./workers/deploymentWorker');

const server = app.listen(config.PORT, async () => {
  logger.info(
    {
      port: config.PORT,
      env: config.NODE_ENV,
    },
    `🚀 DevFlow Sample API running on port ${config.PORT}`
  );

  // Clean up any jobs stuck in RUNNING state from before server restart
  try {
    const prisma = require('./models/prisma').prisma;
    const stuckPipelines = await prisma.pipelineRun.updateMany({
      where: { status: 'RUNNING', startedAt: { lt: new Date(Date.now() - 60 * 60 * 1000) } },
      data: { status: 'FAILED' }
    });
    if (stuckPipelines.count > 0) {
      logger.info(`Cleaned up ${stuckPipelines.count} stuck pipeline runs.`);
    }
  } catch (e) {
    logger.error('Failed to clean up stuck pipelines', e);
  }
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    await disconnectDB();
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught Exception');
  process.exit(1);
});

module.exports = server;
