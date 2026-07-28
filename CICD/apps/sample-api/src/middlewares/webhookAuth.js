const crypto = require('crypto');
const { config } = require('../config');
const { logger } = require('../utils/logger');

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
function verifyGithubWebhook(req, res, next) {
  const secret = config.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    logger.error('GITHUB_WEBHOOK_SECRET is not configured — rejecting all webhooks');
    return res.status(500).json({ error: 'Webhook secret not configured on server' });
  }

  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    logger.warn('Webhook received without X-Hub-Signature-256 header');
    return res.status(401).json({ error: 'Missing webhook signature' });
  }

  // req.rawBody is set by the express.json({ verify }) callback in app.js
  const rawBody = req.rawBody;

  if (!rawBody) {
    logger.error('Raw body not available for webhook signature verification');
    return res.status(500).json({ error: 'Unable to verify webhook signature' });
  }

  const expectedSignature =
    'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  // Use timingSafeEqual to prevent timing attacks
  const sigBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    logger.warn('Webhook signature verification failed', {
      received: signature.substring(0, 20) + '...',
    });
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  logger.debug('Webhook signature verified successfully');
  next();
}

module.exports = { verifyGithubWebhook };
