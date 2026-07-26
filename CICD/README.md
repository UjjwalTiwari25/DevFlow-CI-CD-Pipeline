# DevFlow AI

> A GitHub-integrated CI/CD platform that automatically tests, lints, security-scans, containerizes, and deploys applications — with a live dashboard for pipeline history, health checks, and one-click rollback.

[![CI](https://github.com/YOUR_USERNAME/devflow-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/devflow-ai/actions/workflows/ci.yml)
[![CD](https://github.com/YOUR_USERNAME/devflow-ai/actions/workflows/cd-render.yml/badge.svg)](https://github.com/YOUR_USERNAME/devflow-ai/actions/workflows/cd-render.yml)
[![CodeQL](https://github.com/YOUR_USERNAME/devflow-ai/actions/workflows/codeql.yml/badge.svg)](https://github.com/YOUR_USERNAME/devflow-ai/actions/workflows/codeql.yml)

---

## 🏗️ Architecture

```
Developer → git push → GitHub → GitHub Actions (CI)
  → lint → test → security scan → docker build
  → Deploy to Render (CD) → Health Check → Slack Notification
```

**Full architecture diagram:** See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 📦 Project Structure

```
devflow-ai/
├── apps/
│   └── sample-api/          # Task Management API (Node.js + Express + Prisma)
│       ├── src/
│       │   ├── config/      # Environment validation (Zod)
│       │   ├── controllers/ # Route handlers
│       │   ├── middlewares/  # Auth, validation, error handling
│       │   ├── models/      # Prisma client
│       │   ├── routes/      # Express routes
│       │   ├── services/    # Business logic
│       │   ├── utils/       # JWT, logger, errors, validators
│       │   ├── app.js       # Express app setup
│       │   └── server.js    # Server entry point
│       ├── tests/
│       │   ├── unit/        # Service/utility tests
│       │   └── integration/ # HTTP endpoint tests
│       ├── prisma/
│       │   └── schema.prisma
│       ├── Dockerfile       # Multi-stage production build
│       └── package.json
├── .github/workflows/
│   ├── ci.yml               # Lint → Test → Security → Docker Build
│   ├── cd-render.yml         # Deploy → Health Check → Slack Notify
│   └── codeql.yml            # Weekly SAST analysis
├── infra/
│   └── docker-compose.yml    # Local dev environment
├── docs/
│   ├── ARCHITECTURE.md
│   ├── RUNBOOK.md
│   └── API.md
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker Compose)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/devflow-ai.git
cd devflow-ai

# 2. Start the database
docker compose -f infra/docker-compose.yml up db -d

# 3. Setup the sample API
cd apps/sample-api
cp .env.sample .env
npm install
npx prisma generate
npx prisma db push

# 4. Run the API
npm run dev
```

The API will be available at `http://localhost:3000`.

### Using Docker Compose (full stack)

```bash
# Start everything (API + PostgreSQL)
npm run docker:up

# Stop everything
npm run docker:down
```

---

## 🧪 Testing

```bash
cd apps/sample-api

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Coverage threshold:** 80% on branches, functions, lines, and statements.

---

## 🔐 Security Features

| Feature | Implementation |
|---|---|
| Input validation | Zod schemas on every route |
| Authentication | JWT (access + refresh tokens) |
| Password hashing | bcrypt with configurable salt rounds |
| HTTP hardening | Helmet.js |
| Rate limiting | express-rate-limit (global + auth-specific) |
| Dependency scanning | npm audit (HIGH+) |
| Container scanning | Trivy (CRITICAL + HIGH) |
| SAST | CodeQL (weekly + PRs) |
| Secret scanning | GitHub secret scanning + push protection |
| Non-root container | Docker runs as `appuser` |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Health check |
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login |
| `POST` | `/api/auth/refresh` | ❌ | Refresh access token |
| `GET` | `/api/tasks` | ✅ | List tasks (paginated, filterable) |
| `GET` | `/api/tasks/:id` | ✅ | Get task by ID |
| `POST` | `/api/tasks` | ✅ | Create task |
| `PATCH` | `/api/tasks/:id` | ✅ | Update task |
| `DELETE` | `/api/tasks/:id` | ✅ | Delete task |

**Full API documentation:** See [docs/API.md](docs/API.md)

---

## 🔄 CI/CD Pipeline

### CI (on every push/PR)
1. **Install** — `npm ci` with cache
2. **Lint** — ESLint (flat config)
3. **Format** — Prettier check
4. **Test** — Jest + Supertest with coverage
5. **Security** — `npm audit` + Trivy filesystem scan
6. **Docker** — Build image + Trivy image scan

### CD (on merge to main)
1. **Deploy** — Trigger Render deploy hook
2. **Verify** — Health check polling (up to 5 minutes)
3. **Notify** — Slack webhook (success/failure)
4. **Rollback** — Manual trigger via `workflow_dispatch`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express.js 5 |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| Logging | Pino |
| Testing | Jest + Supertest |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier |
| Container | Docker (multi-stage) |
| CI/CD | GitHub Actions |
| Security | Trivy, CodeQL, npm audit |
| Deploy | Render (API) |

---

## 🚢 Deployment

### Render Setup

1. Create a **Web Service** on Render
2. Point to the `apps/sample-api/Dockerfile`
3. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`
4. Generate a **Deploy Hook URL**
5. Add these GitHub Actions secrets:
   - `RENDER_DEPLOY_HOOK`
   - `PROD_HEALTH_URL`
   - `SLACK_WEBHOOK_URL`

### Database (Neon)

1. Create a Neon project (free tier)
2. Copy the connection string
3. Set it as `DATABASE_URL` in Render + GitHub Secrets

---

## 📋 Runbook

See [docs/RUNBOOK.md](docs/RUNBOOK.md) for operational procedures including:
- Deployment process
- Rollback procedures
- Monitoring and alerting
- Incident response

---

## 📄 License

MIT © Ujjwal
