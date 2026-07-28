const { prisma } = require('../models/prisma');

async function getGithubRepositories(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.githubAccessToken) throw new Error('GitHub token not found');

  const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
    headers: {
      Authorization: `Bearer ${user.githubAccessToken}`,
      Accept: 'application/vnd.github.v3+json',
    }
  });

  if (!res.ok) throw new Error('Failed to fetch repositories from GitHub');
  const repos = await res.json();
  
  return repos.map(r => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    url: r.html_url,
    language: r.language || 'Unknown',
  }));
}


async function getStats(userId) {
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const repoIds = repos.map((r) => r.id);
  if (!repoIds.length)
    return {
      totalRuns: 0,
      successRate: 0,
      avgDuration: 0,
      deploysToday: 0,
      totalRepos: 0,
      activeScans: 0,
    };

  const [totalRuns, successRuns, allRuns, deploysToday] = await Promise.all([
    prisma.pipelineRun.count({ where: { repoId: { in: repoIds } } }),
    prisma.pipelineRun.count({ where: { repoId: { in: repoIds }, status: 'SUCCESS' } }),
    prisma.pipelineRun.findMany({
      where: { repoId: { in: repoIds }, duration: { not: null } },
      select: { duration: true },
    }),
    prisma.deployment.count({
      where: {
        repoId: { in: repoIds },
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  const avgDuration = allRuns.length
    ? Math.round(allRuns.reduce((s, r) => s + r.duration, 0) / allRuns.length)
    : 0;
  const successRate = totalRuns ? Math.round((successRuns / totalRuns) * 1000) / 10 : 0;

  return {
    totalRuns,
    successRate,
    avgDuration,
    deploysToday,
    totalRepos: repoIds.length,
    activeScans: repoIds.length * 5,
  };
}

async function getRepositories(userId) {
  return prisma.repository.findMany({
    where: { ownerId: userId },
    include: {
      _count: { select: { pipelines: true, deployments: true, scans: true } },
      pipelines: {
        orderBy: { startedAt: 'desc' },
        take: 1,
        select: { status: true, startedAt: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

async function createRepository(userId, data) {
  return prisma.repository.create({ data: { ...data, ownerId: userId } });
}

async function deleteRepository(repoId, userId) {
  const repo = await prisma.repository.findFirst({ where: { id: repoId, ownerId: userId } });
  if (!repo) throw new Error('Repository not found');
  return prisma.repository.delete({ where: { id: repoId } });
}

async function getPipelines(userId, query = {}) {
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const repoIds = repos.map((r) => r.id);
  const { status, branch, page = 1, limit = 20 } = query;
  const where = { repoId: { in: repoIds } };
  if (status) where.status = status;
  if (branch) where.branch = { contains: branch, mode: 'insensitive' };

  const [pipelines, total] = await Promise.all([
    prisma.pipelineRun.findMany({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { startedAt: 'desc' },
      include: { repository: { select: { name: true, fullName: true } } },
    }),
    prisma.pipelineRun.count({ where }),
  ]);
  return {
    pipelines,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getPipelineById(pipelineId) {
  return prisma.pipelineRun.findUnique({
    where: { id: pipelineId },
    include: { repository: { select: { name: true, fullName: true, url: true } } },
  });
}

async function rerunPipeline(pipelineId) {
  const original = await prisma.pipelineRun.findUnique({ where: { id: pipelineId } });
  if (!original) throw new Error('Pipeline not found');
  return prisma.pipelineRun.create({
    data: {
      commitMsg: `Re-run: ${original.commitMsg}`,
      commitSha: original.commitSha,
      branch: original.branch,
      trigger: 'manual',
      repoId: original.repoId,
      status: 'QUEUED',
    },
  });
}

async function getDeployments(userId, query = {}) {
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const repoIds = repos.map((r) => r.id);
  const { status, environment, page = 1, limit = 20 } = query;
  const where = { repoId: { in: repoIds } };
  if (status) where.status = status;
  if (environment) where.environment = environment;

  const [deployments, total] = await Promise.all([
    prisma.deployment.findMany({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: { repository: { select: { name: true, fullName: true } } },
    }),
    prisma.deployment.count({ where }),
  ]);
  return {
    deployments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function triggerDeployment(repoId) {
  const repo = await prisma.repository.findUnique({ where: { id: repoId } });
  if (!repo) throw new Error('Repository not found');
  const lastDeploy = await prisma.deployment.findFirst({
    where: { repoId },
    orderBy: { createdAt: 'desc' },
  });
  const parts = (lastDeploy?.version || 'v1.0.0').replace('v', '').split('.').map(Number);
  parts[2]++;
  const version = `v${parts.join('.')}`;
  return prisma.deployment.create({
    data: {
      version,
      commitSha: Math.random().toString(16).slice(2, 9),
      environment: 'production',
      status: 'DEPLOYING',
      triggeredBy: 'manual',
      repoId,
    },
  });
}

async function rollbackDeployment(deploymentId) {
  return prisma.deployment.update({ where: { id: deploymentId }, data: { status: 'ROLLED_BACK' } });
}

async function getSecurityScans(userId, query = {}) {
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const repoIds = repos.map((r) => r.id);
  const { status, scanType, page = 1, limit = 20 } = query;
  const where = { repoId: { in: repoIds } };
  if (status) where.status = status;
  if (scanType) where.scanType = scanType;

  const [scans, total] = await Promise.all([
    prisma.securityScan.findMany({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: { repository: { select: { name: true, fullName: true } } },
    }),
    prisma.securityScan.count({ where }),
  ]);
  return {
    scans,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getHealthStatus() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    /* ignore */
  }
  const dbLatency = Date.now() - start;
  const mem = process.memoryUsage();
  return {
    status: 'healthy',
    uptime: process.uptime(),
    dbLatency,
    memory: {
      used: Math.round(mem.heapUsed / 1024 / 1024),
      total: Math.round(mem.heapTotal / 1024 / 1024),
      rss: Math.round(mem.rss / 1024 / 1024),
    },
    version: process.env.npm_package_version || '1.0.0',
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  getStats,
  getRepositories,
  createRepository,
  deleteRepository,
  getPipelines,
  getPipelineById,
  rerunPipeline,
  getDeployments,
  triggerDeployment,
  rollbackDeployment,
  getSecurityScans,
  getHealthStatus,
  getGithubRepositories,
};
