const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean
  await prisma.securityScan.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.pipelineRun.deleteMany();
  await prisma.task.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.user.deleteMany();

  // User
  const user = await prisma.user.create({
    data: { email: 'saloni@devflow.ai', password: await bcrypt.hash('Password123!', 12), name: 'Saloni Ambatkar' },
  });
  console.log(`✅ User: ${user.email}`);

  // Repos
  const repos = await Promise.all([
    prisma.repository.create({ data: { name: 'sample-api', fullName: 'saloni/sample-api', url: 'https://github.com/saloni/sample-api', language: 'JavaScript', ownerId: user.id } }),
    prisma.repository.create({ data: { name: 'dashboard', fullName: 'saloni/dashboard', url: 'https://github.com/saloni/dashboard', language: 'JavaScript', ownerId: user.id } }),
    prisma.repository.create({ data: { name: 'auth-service', fullName: 'saloni/auth-service', url: 'https://github.com/saloni/auth-service', language: 'TypeScript', ownerId: user.id } }),
  ]);
  console.log(`✅ Repositories: ${repos.length}`);

  // Pipeline runs
  const commits = [
    ['feat: add task filtering and pagination', 'a3f8b2c'],
    ['fix: JWT refresh token expiry validation', 'e7d1f4a'],
    ['ci: add Trivy container image scanning', 'b9c3e5d'],
    ['test: increase coverage to 92%', 'f2a8c1b'],
    ['feat: add rate limiting to auth routes', 'd4e6f8a'],
    ['chore: upgrade Express to v5', 'c1b3d5e'],
    ['refactor: extract validation middleware', '7a2b3c4'],
    ['fix: CORS headers for dashboard origin', '8b3c4d5'],
    ['feat: add health check endpoint', '9c4d5e6'],
    ['docs: update API documentation', '1d5e6f7'],
    ['security: fix SQL injection in search', '2e6f7a8'],
    ['perf: optimize database queries', '3f7a8b9'],
    ['feat: implement webhook ingestion', '4a8b9c0'],
    ['fix: rate limiter window calculation', '5b9c0d1'],
    ['ci: add CodeQL SAST analysis', '6c0d1e2'],
  ];
  const statuses = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED', 'SUCCESS', 'SUCCESS', 'RUNNING', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'QUEUED', 'SUCCESS', 'SUCCESS'];
  const branches = ['main', 'main', 'develop', 'main', 'feature/rate-limit', 'main', 'main', 'fix/cors', 'main', 'main', 'hotfix/sql', 'main', 'feature/webhooks', 'develop', 'main'];

  const now = Date.now();
  const pipelines = [];
  for (let i = 0; i < commits.length; i++) {
    const startedAt = new Date(now - i * 3600000 - Math.random() * 1800000);
    const duration = 120 + Math.floor(Math.random() * 120);
    const s = statuses[i];
    pipelines.push(await prisma.pipelineRun.create({
      data: {
        commitMsg: commits[i][0], commitSha: commits[i][1], branch: branches[i],
        status: s, trigger: i === 12 ? 'manual' : 'push', duration: s === 'QUEUED' || s === 'RUNNING' ? null : duration,
        lintPassed: s !== 'QUEUED', testsPassed: s === 'SUCCESS' || s === 'RUNNING' ? true : s === 'FAILED' ? false : null,
        testCoverage: s === 'SUCCESS' ? 85 + Math.random() * 10 : null,
        buildPassed: s === 'SUCCESS', repoId: repos[i % repos.length].id,
        startedAt, finishedAt: s === 'SUCCESS' || s === 'FAILED' ? new Date(startedAt.getTime() + duration * 1000) : null,
      },
    }));
  }
  console.log(`✅ Pipeline runs: ${pipelines.length}`);

  // Deployments
  const deployData = [
    { version: 'v1.4.2', sha: 'a3f8b2c', status: 'LIVE', dur: 45, ago: 300000 },
    { version: 'v1.4.1', sha: 'e7d1f4a', status: 'LIVE', dur: 52, ago: 2700000 },
    { version: 'v1.4.0', sha: 'f2a8c1b', status: 'LIVE', dur: 48, ago: 10800000 },
    { version: 'v1.3.9', sha: 'd4e6f8a', status: 'FAILED', dur: 12, ago: 18000000 },
    { version: 'v1.3.8', sha: 'c1b3d5e', status: 'ROLLED_BACK', dur: 55, ago: 28800000 },
    { version: 'v1.3.7', sha: '7a2b3c4', status: 'LIVE', dur: 41, ago: 86400000 },
    { version: 'v1.3.6', sha: '9c4d5e6', status: 'LIVE', dur: 50, ago: 172800000 },
    { version: 'v1.0.1', sha: '3f7a8b9', status: 'LIVE', dur: 38, ago: 4000000, repo: 1 },
    { version: 'v1.0.0', sha: '5b9c0d1', status: 'LIVE', dur: 65, ago: 86400000, repo: 2 },
  ];
  for (const d of deployData) {
    await prisma.deployment.create({
      data: {
        version: d.version, commitSha: d.sha, status: d.status, duration: d.dur,
        environment: 'production', triggeredBy: 'ci', repoId: repos[d.repo || 0].id,
        createdAt: new Date(now - d.ago),
        finishedAt: d.status !== 'PENDING' ? new Date(now - d.ago + d.dur * 1000) : null,
      },
    });
  }
  console.log(`✅ Deployments: ${deployData.length}`);

  // Security scans
  const scanners = [
    { type: 'dependency', scanner: 'npm audit' },
    { type: 'filesystem', scanner: 'Trivy FS' },
    { type: 'container', scanner: 'Trivy Image' },
    { type: 'sast', scanner: 'CodeQL' },
    { type: 'secrets', scanner: 'GitHub Secret Scanning' },
  ];
  for (const repo of repos) {
    for (const sc of scanners) {
      const passed = Math.random() > 0.1;
      await prisma.securityScan.create({
        data: {
          scanType: sc.type, scanner: sc.scanner, status: passed ? 'PASSED' : 'FAILED',
          criticalCount: passed ? 0 : Math.floor(Math.random() * 2),
          highCount: passed ? 0 : Math.floor(Math.random() * 3),
          mediumCount: Math.floor(Math.random() * 5),
          lowCount: Math.floor(Math.random() * 10),
          repoId: repo.id,
        },
      });
    }
  }
  console.log(`✅ Security scans: ${repos.length * scanners.length}`);

  // Tasks
  const tasks = ['Setup CI pipeline', 'Add Docker multi-stage build', 'Configure Trivy scanning', 'Write integration tests', 'Deploy to Render', 'Add CodeQL analysis'];
  const taskStatuses = ['DONE', 'DONE', 'DONE', 'DONE', 'IN_PROGRESS', 'TODO'];
  for (let i = 0; i < tasks.length; i++) {
    await prisma.task.create({
      data: { title: tasks[i], description: `Task ${i + 1} for DevFlow AI`, status: taskStatuses[i], priority: i < 3 ? 'HIGH' : 'MEDIUM', userId: user.id },
    });
  }
  console.log(`✅ Tasks: ${tasks.length}`);

  console.log('\n🎉 Seed complete! Login with: saloni@devflow.ai / Password123!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
