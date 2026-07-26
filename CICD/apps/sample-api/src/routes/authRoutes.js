const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../utils/validators');

const router = Router();

// Rate limit auth routes more strictly (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, authController.refresh);

module.exports = router;
