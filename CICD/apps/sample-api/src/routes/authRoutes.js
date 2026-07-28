const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/github', authLimiter, authController.githubLogin);
router.get('/github/callback', authLimiter, authController.githubCallback);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
