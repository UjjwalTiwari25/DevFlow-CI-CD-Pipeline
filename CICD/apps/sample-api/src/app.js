const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { config } = require('./config');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const healthRoutes = require('./routes/healthRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    status: 'error',
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/webhooks', webhookRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
