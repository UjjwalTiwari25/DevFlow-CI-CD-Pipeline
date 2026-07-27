const { prisma } = require('../models/prisma');
const { logger } = require('../utils/logger');

const enforceUsageLimits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 1. Fetch user's subscription
    const sub = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!sub) {
      // For legacy users without a subscription, let them pass or handle it.
      // We will assume they are on FREE trial if missing for now.
      return next();
    }

    // 2. Check Trial Expiry
    if (sub.status === 'TRIAL' && new Date() > sub.trialEndsAt) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'PAST_DUE' }
      });
      return res.status(403).json({ 
        error: 'TRIAL_EXPIRED',
        message: 'Your 30-day trial has expired. Please upgrade your plan to continue using DevFlow AI.' 
      });
    }

    if (sub.status === 'PAST_DUE' || sub.status === 'CANCELED') {
      return res.status(403).json({ 
        error: 'SUBSCRIPTION_INACTIVE',
        message: 'Your subscription is inactive. Please update your billing information.' 
      });
    }

    // 3. Check Repository Limits for FREE users
    if (sub.plan === 'FREE') {
      const repoCount = await prisma.repository.count({
        where: { ownerId: userId }
      });

      if (repoCount >= 5) {
        return res.status(403).json({
          error: 'REPO_LIMIT_REACHED',
          message: 'Free tier is limited to 5 repositories. Please upgrade to Pro to add more.'
        });
      }
    }

    next();
  } catch (err) {
    logger.error('Usage limits middleware error', { error: err.message });
    res.status(500).json({ error: 'Failed to verify usage limits' });
  }
};

module.exports = {
  enforceUsageLimits
};
