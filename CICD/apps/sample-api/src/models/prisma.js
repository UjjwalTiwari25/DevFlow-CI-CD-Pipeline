const { PrismaClient } = require('@prisma/client');
const { config } = require('../config');
const { logger } = require('../utils/logger');

/**
 * Singleton Prisma client instance.
 * In test environments, we allow overriding for mocking.
 */
let prisma;

if (config.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
  });
} else {
  // Prevent hot-reload from creating new connections in development
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

/**
 * Gracefully disconnect Prisma on shutdown.
 */
async function disconnectDB() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error({ err: error }, 'Error disconnecting database');
  }
}

module.exports = { prisma, disconnectDB };
