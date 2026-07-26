const app = require('./app');
const { config } = require('./config');
const { logger } = require('./utils/logger');
const { disconnectDB } = require('./models/prisma');

const server = app.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      env: config.NODE_ENV,
    },
    `🚀 DevFlow Sample API running on port ${config.PORT}`
  );
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
