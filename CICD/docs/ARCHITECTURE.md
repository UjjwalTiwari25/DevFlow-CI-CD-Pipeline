# Architecture — DevFlow AI

## System Overview

DevFlow AI is a CI/CD platform built as a monorepo with two tracks:

- **Track A (Core Pipeline):** A sample Node.js API with automated testing, security scanning, containerization, and deployment
- **Track B (Platform Layer):** A dashboard for managing multiple repositories and pipeline runs (future)

---

## High-Level Architecture

```
                         ┌─────────────────────────┐
                         │      Developer           │
                         └────────────┬─────────────┘
                                      │ git push
                                      ▼
                         ┌─────────────────────────┐
                         │   GitHub Repository      │
                         └────────────┬─────────────┘
                                      │ webhook
                                      ▼
                    ┌───────────────────────────────────┐
                    │        GitHub Actions (CI)         │
                    │                                    │
                    │  ┌──────────────────────────────┐  │
                    │  │ Quality Job                   │  │
                    │  │  → npm ci                     │  │
                    │  │  → prisma generate            │  │
                    │  │  → eslint                     │  │
                    │  │  → prettier check             │  │
                    │  │  → jest --coverage            │  │
                    │  └──────────────────────────────┘  │
                    │              │                      │
                    │              ▼                      │
                    │  ┌──────────────────────────────┐  │
                    │  │ Security Job                  │  │
                    │  │  → npm audit                  │  │
                    │  │  → trivy fs scan              │  │
                    │  └──────────────────────────────┘  │
                    │              │                      │
                    │              ▼                      │
                    │  ┌──────────────────────────────┐  │
                    │  │ Docker Build Job              │  │
                    │  │  → docker buildx              │  │
                    │  │  → trivy image scan           │  │
                    │  └──────────────────────────────┘  │
                    └────────────────┬────────────────────┘
                                     │ CI passes on main
                                     ▼
                    ┌───────────────────────────────────┐
                    │        GitHub Actions (CD)         │
                    │  → trigger Render deploy hook      │
                    │  → poll health check               │
                    │  → notify Slack                    │
                    └────────────────┬────────────────────┘
                                     │
                                     ▼
                    ┌───────────────────────────────────┐
                    │           Render                   │
                    │  Docker-based Web Service           │
                    │  + Neon PostgreSQL                  │
                    └───────────────────────────────────┘
```

---

## Application Architecture

### Sample API (Task Management)

```
src/
├── config/           # Zod-validated environment configuration
├── controllers/      # Thin HTTP handlers (delegate to services)
├── middlewares/
│   ├── auth.js       # JWT token verification
│   ├── validate.js   # Zod schema validation factory
│   └── errorHandler.js # Centralized error handling
├── models/
│   └── prisma.js     # Singleton Prisma client
├── routes/           # Express route definitions
├── services/         # Business logic layer
│   ├── authService.js
│   └── taskService.js
├── utils/
│   ├── errors.js     # Custom error class hierarchy
│   ├── jwt.js        # Token generation/verification
│   ├── logger.js     # Pino structured logging
│   └── validators.js # Zod schemas
├── app.js            # Express app with middleware stack
└── server.js         # HTTP server with graceful shutdown
```

### Design Decisions

1. **Express 5** — Async error handling improvements, modern API
2. **Prisma ORM** — Type-safe queries, built-in migrations, excellent DX
3. **Zod** — Runtime validation matching static types
4. **Pino** — High-performance structured JSON logging
5. **JWT** — Stateless auth with access + refresh token pattern
6. **Multi-stage Docker** — Smaller images, better caching, non-root user

---

## Security Architecture

```
┌──────────────────────────────────────────────┐
│                Request Flow                   │
│                                              │
│  Client → Rate Limiter → Helmet → CORS       │
│    → Body Parser (10kb limit)                │
│    → Auth Middleware (JWT verify)              │
│    → Validation Middleware (Zod)               │
│    → Controller → Service → Prisma → DB       │
│    → Error Handler → Structured Response      │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Database Schema

```
┌────────────┐       ┌────────────────┐
│   users    │       │     tasks      │
├────────────┤       ├────────────────┤
│ id (PK)    │──────<│ user_id (FK)   │
│ email (UQ) │       │ id (PK)        │
│ password   │       │ title          │
│ name       │       │ description    │
│ created_at │       │ status (enum)  │
│ updated_at │       │ priority (enum)│
└────────────┘       │ due_date       │
                     │ created_at     │
                     │ updated_at     │
                     └────────────────┘
```

---

## Deployment Architecture

- **API:** Render Web Service (Docker)
- **Database:** Neon PostgreSQL (serverless)
- **CI/CD:** GitHub Actions (free tier)
- **Monitoring:** Health check endpoint + UptimeRobot
- **Notifications:** Slack webhooks
