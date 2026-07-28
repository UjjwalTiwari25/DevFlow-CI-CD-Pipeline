const { Queue } = require('bullmq');

// ─── Fix #6: Environment-driven Redis connection ─────────────────────────────
// Parse REDIS_URL from environment (works with Render, ECS, etc.)
// Falls back to localhost for docker-compose local development.
function parseRedisConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: Number(url.port) || 6379,
      password: url.password || undefined,
      username: url.username || undefined,
      // Render and other providers often require TLS
      ...(url.protocol === 'rediss:' ? { tls: {} } : {}),
    };
  }

  // Default for local docker-compose development
  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 16379,
  };
}

const connection = parseRedisConnection();

const pipelineQueue = new Queue('pipeline-queue', { 
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false
  }
});

const deploymentQueue = new Queue('deployment-queue', { 
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false
  }
});

module.exports = {
  pipelineQueue,
  deploymentQueue,
  connection,
};
