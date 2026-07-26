const { Router } = require('express');

const router = Router();

/**
 * GET /health
 * Health check endpoint for CI/CD pipeline verification.
 * Returns 200 with status details when the service is healthy.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'devflow-sample-api',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
    },
  });
});

module.exports = router;
