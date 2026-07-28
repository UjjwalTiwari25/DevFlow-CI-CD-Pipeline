const crypto = require('crypto');
const { config } = require('../config');
const { logger } = require('../utils/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware to verify GitHub webhook HMAC-SHA256 signatures.
 *
 * GitHub signs every webhook payload with the secret configured on the hook.
 * We MUST verify this before trusting any data in the body. Without this check,
 * anyone who knows a registered repo's `fullName` can forge a push event and
 * trigger arbitrary pipeline runs (or worse — command injection).
 *
 * Usage: mount BEFORE the webhook handler on the route.
 *
 * IMPORTANT: This middleware requires the raw request body. Express's default
 * json() parser consumes the body, so we configure a raw body buffer in app.js.
 */
async function verifyGithubWebhook(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    logger.warn('Webhook received without X-Hub-Signature-256 header');
    return res.status(401).json({ error: 'Missing webhook signature' });
  }

  const rawBody = req.rawBody;

  if (!rawBody) {
    logger.error('Raw body not available for webhook signature verification');
    return res.status(500).json({ error: 'Unable to verify webhook signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const repoFullName = payload?.repository?.full_name;
  if (!repoFullName) {
    return res.status(400).json({ error: 'Missing repository.full_name in payload' });
  }

  const repo = await prisma.repository.findFirst({
    where: { fullName: repoFullName, isActive: true },
  });

  if (!repo) {
    return res.status(404).json({ error: 'Repository not registered' });
  }

  const secret = repo.webhookSecret || config.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    logger.error('No webhook secret configured for repo or globally');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const expectedSignature =
    'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  const sigBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    logger.warn('Webhook signature verification failed');
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  // Update last received at
  await prisma.repository.update({
    where: { id: repo.id },
    data: { lastWebhookReceivedAt: new Date() }
  });

  logger.debug('Webhook signature verified successfully');
  
  // Attach repo to req so controller doesn't have to look it up again
  req.repo = repo;
  
  next();
}

module.exports = { verifyGithubWebhook };
