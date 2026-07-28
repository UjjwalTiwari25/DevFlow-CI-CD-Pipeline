/**
 * Unit tests for GitHub webhook HMAC signature verification.
 * Tests the security-critical path that prevents forged webhook payloads.
 */
const crypto = require('crypto');

// Mock the config module
jest.mock('../../src/config', () => ({
  config: {
    GITHUB_WEBHOOK_SECRET: 'test-webhook-secret-for-hmac-verification',
  },
}));

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const { verifyGithubWebhook } = require('../../src/middlewares/webhookAuth');

function createMockReqResNext() {
  const req = {
    headers: {},
    rawBody: null,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
}

function signPayload(body, secret) {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

describe('verifyGithubWebhook', () => {
  const SECRET = 'test-webhook-secret-for-hmac-verification';
  const PAYLOAD = JSON.stringify({ action: 'push', ref: 'refs/heads/main' });

  it('should call next() when signature is valid', () => {
    const { req, res, next } = createMockReqResNext();
    req.rawBody = Buffer.from(PAYLOAD);
    req.headers['x-hub-signature-256'] = signPayload(req.rawBody, SECRET);

    verifyGithubWebhook(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should reject when no signature header is present', () => {
    const { req, res, next } = createMockReqResNext();
    req.rawBody = Buffer.from(PAYLOAD);

    verifyGithubWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Missing webhook signature' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject when signature is invalid (tampered payload)', () => {
    const { req, res, next } = createMockReqResNext();
    req.rawBody = Buffer.from(PAYLOAD);
    req.headers['x-hub-signature-256'] = signPayload(Buffer.from('tampered'), SECRET);

    verifyGithubWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Invalid webhook signature' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject when signature uses wrong secret', () => {
    const { req, res, next } = createMockReqResNext();
    req.rawBody = Buffer.from(PAYLOAD);
    req.headers['x-hub-signature-256'] = signPayload(req.rawBody, 'wrong-secret');

    verifyGithubWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject when rawBody is missing', () => {
    const { req, res, next } = createMockReqResNext();
    req.headers['x-hub-signature-256'] = 'sha256=abc123';

    verifyGithubWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Unable to verify webhook signature' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 when GITHUB_WEBHOOK_SECRET is not configured', () => {
    // Override the config for this test
    const configModule = require('../../src/config');
    const originalSecret = configModule.config.GITHUB_WEBHOOK_SECRET;
    configModule.config.GITHUB_WEBHOOK_SECRET = '';

    const { req, res, next } = createMockReqResNext();
    req.rawBody = Buffer.from(PAYLOAD);
    req.headers['x-hub-signature-256'] = signPayload(req.rawBody, SECRET);

    verifyGithubWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();

    // Restore
    configModule.config.GITHUB_WEBHOOK_SECRET = originalSecret;
  });
});
