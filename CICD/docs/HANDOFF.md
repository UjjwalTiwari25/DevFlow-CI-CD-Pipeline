# DevFlow AI — Project Handoff Documentation

## 1. Project Overview
**DevFlow AI** is a next-generation, autonomous Continuous Integration and Continuous Deployment (CI/CD) platform. It bridges the gap between complex DevOps configuration and developer productivity by utilizing AI to auto-generate, monitor, and optimize deployment pipelines. 

The goal of the platform is to allow developers to ship code faster and more securely by providing a "zero-configuration" pipeline experience. Users connect their repositories, and DevFlow AI handles the linting, testing, security scanning, containerization, and deployment.

---

## 2. Core Features & Capabilities
- **Intelligent Pipeline Generation:** Automatically analyzes repository languages and frameworks to generate custom YAML pipelines.
- **Advanced Security Scanning:** Integrates with tools (like Trivy and CodeQL) to detect vulnerabilities, secret leaks, and insecure dependencies before they reach production.
- **Automated Deployments:** Containerizes applications and pushes them to cloud environments seamlessly upon successful builds.
- **Centralized Dashboard:** A stunning, modern dark-themed user interface to track pipeline status, view deployment history, and monitor repository health.
- **Smart Rollbacks:** Automatically detects production anomalies and supports rapid rollback to the last stable version.

---

## 3. Technology Stack & Architecture

### Frontend Architecture (`/apps/dashboard`)
The client-side dashboard is built for extreme performance and aesthetics:
- **Framework:** React 19 (via Vite)
- **Routing:** React Router v7 for client-side navigation and protected routes.
- **Styling:** Custom CSS (`index.css` and `Landing.css`) leveraging CSS Variables, Flexbox/Grid, Glassmorphism, and responsive media queries.
- **Icons:** `lucide-react` for lightweight, scalable vector icons.
- **State Management:** React hooks with `localStorage` for JWT session persistence.

### Backend Architecture (`/apps/sample-api`)
The backend is a robust REST API designed to handle heavy integrations and webhook processing:
- **Framework:** Node.js with Express v5.
- **Database ORM:** Prisma ORM for type-safe database queries and migrations.
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` for secure password hashing.
- **Security:** `express-rate-limit` to prevent brute-force attacks on auth endpoints.
- **Testing:** Integration and unit tests implemented for CI stability.

---

## 4. How It Works (The Workflow)

1. **User Onboarding & Auth:** A user signs up or logs in via the visually appealing marketing landing page. Authentication is handled securely, and the user lands on the main dashboard.
2. **Repository Connection:** Users link their Git repositories (GitHub/GitLab). DevFlow ingests the repository metadata.
3. **Webhook Ingestion:** When a developer pushes code, the Git provider sends a webhook to the backend API.
4. **Pipeline Execution:** DevFlow registers a new `PipelineRun` in the database. It simulates or triggers the actual linting, unit testing, and security scanning jobs.
5. **Real-time Feedback:** The frontend dashboard polls (or receives) status updates, reflecting live UI changes via status badges (Running, Queued, Success, Failed).
6. **Deployment:** If all checks pass, the deployment service updates the `Deployment` record, marking the new version as `LIVE`.

---

## 5. How It Helps Others
DevFlow AI serves as a powerful DevOps multiplier for engineering teams:
- **Reduces Overhead:** Teams no longer need dedicated DevOps engineers to write complex GitHub Actions or Jenkins files.
- **Improves Code Quality:** Mandatory AI-driven tests and linting ensure that sloppy code never merges to the main branch.
- **Security by Default:** Proactive scanning catches vulnerabilities (like SQL injections or leaked AWS keys) early in the development lifecycle.
- **Fast Recovery:** If a bad deployment occurs, the "Smart Rollbacks" feature allows teams to restore service instantly, protecting end-user experience.

---

## 6. Next Steps & Maintenance
- **Database:** The database schema is defined in `apps/sample-api/prisma/schema.prisma`. Use `npx prisma studio` to inspect records manually.
- **Local Development:** 
  - Backend: `cd apps/sample-api && npm run dev`
  - Frontend: `cd apps/dashboard && npm run dev`
- **Future Enhancements:** 
  - Connect WebSocket for real-time dashboard updates (currently relies on refetching).
  - Implement real Docker container orchestration (currently API driven tracking).
  - Add OAuth integrations for seamless GitHub/GitLab login.

**Maintainer:** Saloni Ambatkar
