# Runbook — DevFlow AI

This document contains operational procedures for the DevFlow AI platform.

---

## 1. Deployment

### Standard Deployment (Automated)

1. Push code to `main` branch
2. CI pipeline runs automatically (lint → test → security → docker build)
3. On CI success, CD pipeline triggers Render deploy hook
4. Health check verifies the deployment
5. Slack notification confirms success/failure

### Manual Deployment

```bash
# Trigger deploy hook manually
curl -X POST "$RENDER_DEPLOY_HOOK"

# Verify health
curl https://your-app.onrender.com/health
```

### Pre-Deployment Checklist

- [ ] All tests pass locally (`npm test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No known HIGH/CRITICAL vulnerabilities (`npm audit`)
- [ ] Environment variables updated if needed
- [ ] Database migrations applied if schema changed

---

## 2. Rollback

### Via GitHub Actions

1. Go to Actions → CD → "Rollback (Manual Trigger)"
2. Click "Run workflow"
3. Monitor the rollback

### Via Render Dashboard

1. Go to Render Dashboard → Your Service
2. Click "Manual Deploy" → "Deploy previous version"
3. Wait for health check to pass

### Via Render API

```bash
curl -X POST \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services/$SERVICE_ID/rollback"
```

---

## 3. Database Operations

### Run Migrations

```bash
cd apps/sample-api
npx prisma migrate deploy  # Production
npx prisma migrate dev     # Development
```

### View Database

```bash
npx prisma studio
```

### Reset Database (Development Only!)

```bash
npx prisma migrate reset
```

---

## 4. Monitoring

### Health Check

```bash
curl https://your-app.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "devflow-sample-api",
  "version": "1.0.0",
  "uptime": 12345.67,
  "memory": {
    "used": "45MB",
    "total": "90MB"
  }
}
```

### Logs

- **Render Dashboard:** Service → Logs (live stream)
- **Structured format:** All logs are JSON via Pino
- **Log levels:** fatal, error, warn, info, debug, trace

---

## 5. Incident Response

### Service Down

1. Check health endpoint
2. Check Render dashboard for deploy status
3. Review recent commits on `main`
4. If bad deploy: rollback immediately
5. If infrastructure issue: check Render status page

### Database Connection Issues

1. Check Neon dashboard for connection pool usage
2. Verify `DATABASE_URL` in Render env vars
3. Check Prisma connection logs
4. Consider increasing connection pool size

### High Memory Usage

1. Check `/health` endpoint for memory stats
2. Review for memory leaks in recent commits
3. Restart the service on Render
4. Scale up if persistent

---

## 6. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | JWT signing secret (min 32 chars) |
| `NODE_ENV` | ✅ | `production` / `development` / `test` |
| `PORT` | ❌ | Server port (default: 3000) |
| `LOG_LEVEL` | ❌ | Pino log level (default: info) |
| `CORS_ORIGIN` | ❌ | Allowed CORS origin (default: *) |
| `BCRYPT_SALT_ROUNDS` | ❌ | Password hash rounds (default: 12) |
| `RATE_LIMIT_WINDOW_MS` | ❌ | Rate limit window (default: 900000) |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | Max requests per window (default: 100) |

### GitHub Actions Secrets

| Secret | Purpose |
|---|---|
| `RENDER_DEPLOY_HOOK` | Render deploy hook URL |
| `PROD_HEALTH_URL` | Production health check URL |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook |
| `RENDER_API_KEY` | Render API key (for rollback) |
| `RENDER_SERVICE_ID` | Render service ID (for rollback) |
