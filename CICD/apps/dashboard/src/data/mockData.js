// Mock data for the DevFlow AI dashboard

export const pipelineRuns = [
  {
    id: 'run-001',
    commit: 'feat: add task filtering and pagination',
    sha: 'a3f8b2c',
    branch: 'main',
    status: 'success',
    duration: '2m 34s',
    time: '2 minutes ago',
    author: 'ujjwal',
  },
  {
    id: 'run-002',
    commit: 'fix: JWT refresh token expiry validation',
    sha: 'e7d1f4a',
    branch: 'main',
    status: 'success',
    duration: '2m 18s',
    time: '45 minutes ago',
    author: 'ujjwal',
  },
  {
    id: 'run-003',
    commit: 'ci: add Trivy container image scanning',
    sha: 'b9c3e5d',
    branch: 'develop',
    status: 'running',
    duration: '1m 52s',
    time: '1 hour ago',
    author: 'ujjwal',
  },
  {
    id: 'run-004',
    commit: 'test: increase coverage to 92%',
    sha: 'f2a8c1b',
    branch: 'main',
    status: 'success',
    duration: '3m 01s',
    time: '3 hours ago',
    author: 'ujjwal',
  },
  {
    id: 'run-005',
    commit: 'feat: add rate limiting to auth routes',
    sha: 'd4e6f8a',
    branch: 'feature/rate-limit',
    status: 'failed',
    duration: '1m 47s',
    time: '5 hours ago',
    author: 'ujjwal',
  },
  {
    id: 'run-006',
    commit: 'chore: upgrade Express to v5',
    sha: 'c1b3d5e',
    branch: 'main',
    status: 'success',
    duration: '2m 42s',
    time: '8 hours ago',
    author: 'ujjwal',
  },
];

export const stats = {
  totalRuns: 247,
  successRate: 96.4,
  avgDuration: '2m 38s',
  deploysToday: 8,
};

export const securityScans = [
  { name: 'npm audit', desc: 'Dependency vulnerabilities', status: 'pass', icon: '📦' },
  { name: 'Trivy FS', desc: 'Filesystem scan', status: 'pass', icon: '🔍' },
  { name: 'Trivy Image', desc: 'Container image scan', status: 'pass', icon: '🐳' },
  { name: 'CodeQL', desc: 'Static analysis (SAST)', status: 'pass', icon: '🛡️' },
  { name: 'Secret Scan', desc: 'GitHub push protection', status: 'pass', icon: '🔑' },
];

export const deployHistory = [
  { version: 'v1.4.2', time: '2 min ago', status: 'success', commit: 'a3f8b2c' },
  { version: 'v1.4.1', time: '45 min ago', status: 'success', commit: 'e7d1f4a' },
  { version: 'v1.4.0', time: '3 hours ago', status: 'success', commit: 'f2a8c1b' },
  { version: 'v1.3.9', time: '5 hours ago', status: 'failed', commit: 'd4e6f8a' },
  { version: 'v1.3.8', time: '8 hours ago', status: 'success', commit: 'c1b3d5e' },
];

export const techStack = [
  { name: 'Node.js 22', icon: '🟢' },
  { name: 'Express 5', icon: '⚡' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Prisma ORM', icon: '◆' },
  { name: 'Docker', icon: '🐳' },
  { name: 'GitHub Actions', icon: '⚙️' },
  { name: 'Jest', icon: '🧪' },
  { name: 'Trivy', icon: '🔒' },
  { name: 'CodeQL', icon: '🛡️' },
  { name: 'Render', icon: '🚀' },
  { name: 'Pino Logger', icon: '📝' },
  { name: 'Zod', icon: '✅' },
];

export const pipelineSteps = [
  { label: 'Checkout', state: 'done' },
  { label: 'Install', state: 'done' },
  { label: 'Lint', state: 'done' },
  { label: 'Test', state: 'done' },
  { label: 'Security', state: 'done' },
  { label: 'Docker', state: 'active' },
  { label: 'Deploy', state: 'pending' },
  { label: 'Health', state: 'pending' },
];
