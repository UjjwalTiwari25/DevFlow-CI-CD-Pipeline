/**
 * Unit tests for the enforceUsageLimits middleware.
 * Verifies that users without subscriptions are not silently bypassed (#8).
 */

jest.mock('../../src/models/prisma', () => ({
  prisma: {
    subscription: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    repository: {
      count: jest.fn(),
    },
  },
}));

jest.mock('../../src/utils/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const { prisma } = require('../../src/models/prisma');
const { enforceUsageLimits } = require('../../src/middlewares/usage');

function createMockReqResNext(userId = 'user-1') {
  return {
    req: { user: { id: userId } },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
    next: jest.fn(),
  };
}

describe('enforceUsageLimits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should backfill a FREE trial for users without a subscription (fix #8)', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockResolvedValue(null);
    prisma.subscription.create.mockResolvedValue({
      id: 'sub-new',
      userId: 'user-1',
      plan: 'FREE',
      status: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    prisma.repository.count.mockResolvedValue(0);

    await enforceUsageLimits(req, res, next);

    // Should have created a subscription
    expect(prisma.subscription.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          plan: 'FREE',
          status: 'TRIAL',
        }),
      })
    );
    // Should still call next (within limits)
    expect(next).toHaveBeenCalled();
  });

  it('should block expired trials', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockResolvedValue({
      id: 'sub-1',
      plan: 'FREE',
      status: 'TRIAL',
      trialEndsAt: new Date(Date.now() - 1000), // Already expired
    });
    prisma.subscription.update.mockResolvedValue({});

    await enforceUsageLimits(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'TRIAL_EXPIRED' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should block PAST_DUE subscriptions', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockResolvedValue({
      id: 'sub-1',
      plan: 'FREE',
      status: 'PAST_DUE',
    });

    await enforceUsageLimits(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'SUBSCRIPTION_INACTIVE' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should block CANCELED subscriptions', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockResolvedValue({
      id: 'sub-1',
      plan: 'FREE',
      status: 'CANCELED',
    });

    await enforceUsageLimits(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should block FREE users who exceed 5 repos', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockResolvedValue({
      id: 'sub-1',
      plan: 'FREE',
      status: 'ACTIVE',
    });
    prisma.repository.count.mockResolvedValue(5);

    await enforceUsageLimits(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'REPO_LIMIT_REACHED' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow FREE users under the repo limit', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockResolvedValue({
      id: 'sub-1',
      plan: 'FREE',
      status: 'ACTIVE',
    });
    prisma.repository.count.mockResolvedValue(3);

    await enforceUsageLimits(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should allow PRO users without repo limits', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockResolvedValue({
      id: 'sub-1',
      plan: 'PRO',
      status: 'ACTIVE',
    });

    await enforceUsageLimits(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(prisma.repository.count).not.toHaveBeenCalled();
  });

  it('should return 500 on unexpected errors', async () => {
    const { req, res, next } = createMockReqResNext();

    prisma.subscription.findUnique.mockRejectedValue(new Error('DB connection failed'));

    await enforceUsageLimits(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });
});
