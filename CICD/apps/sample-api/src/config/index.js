const { z } = require('zod');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/devflow'),
  JWT_SECRET: z.string().min(32).default('devflow-ai-jwt-secret-change-in-production-min32chars'),
  JWT_EXPIRES_IN: z.string().default('30d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string().default('*'),

  GITHUB_WEBHOOK_SECRET: z.string().min(1).optional(),

  // ─── GitHub OAuth ────────────────────────────────────────────────────────────
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().default('https://cicd-two-smoky.vercel.app'),

  // ─── Redis (#6) ────────────────────────────────────────────────────────────
  // Environment-driven Redis connection instead of hardcoded localhost:16379
  REDIS_URL: z.string().optional(),
});

let config;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = { config };
