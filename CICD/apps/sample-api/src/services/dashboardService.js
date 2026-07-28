const { prisma } = require('../models/prisma');
const { pipelineQueue, deploymentQueue } = require('../utils/queue');
const crypto = require('crypto');

async function getGithubRepositories(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.githubAccessToken) throw new Error('GitHub token not found');

  const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
    headers: {
      Authorization: `Bearer ${user.githubAccessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'DevFlow-AI-App',
      'X-GitHub-Api-Version': '2022-11-28',
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    // eslint-disable-next-line no-console
    console.error('GitHub API Error (Repos):', res.status, errText);
    throw new Error('Failed to fetch repositories from GitHub');
  }
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
  const { id, ...repoData } = data; // Strip GitHub's numeric ID
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const webhookSecret = crypto.randomBytes(32).toString('hex');
  const apiUrl = process.env.API_URL || process.env.RENDER_EXTERNAL_URL || 'https://cicd-i4ud.onrender.com';

  if (user && user.githubAccessToken) {
    const res = await fetch(`https://api.github.com/repos/${repoData.fullName}/hooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['push'],
        config: {
          url: `${apiUrl}/api/webhooks/github`,
          content_type: 'json',
          secret: webhookSecret
        }
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      // eslint-disable-next-line no-console
      console.error('Failed to register webhook:', errText);
      throw new Error(`Failed to register webhook: ${errText}`);
    }
  }

  return prisma.repository.create({ data: { ...repoData, ownerId: userId, webhookSecret } });
}

async function deleteRepository(repoId, userId) {
  const repo = await prisma.repository.findFirst({ where: { id: repoId, ownerId: userId } });
  if (!repo) throw new Error('Repository not found');
  return prisma.repository.delete({ where: { id: repoId } });
}

async function triggerPipeline(repoId, userId) {
  const repo = await prisma.repository.findFirst({ where: { id: repoId, ownerId: userId } });
  if (!repo) throw new Error('Repository not found or access denied');
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.githubAccessToken) throw new Error('GitHub token not found');

  const res = await fetch(`https://api.github.com/repos/${repo.fullName}/commits?per_page=1`, {
    headers: {
      Authorization: `Bearer ${user.githubAccessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'DevFlow-AI-App',
      'X-GitHub-Api-Version': '2022-11-28',
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    // eslint-disable-next-line no-console
    console.error('Failed to fetch latest commit:', errText);
    throw new Error('Failed to fetch latest commit from GitHub');
  }
  const commits = await res.json();
  if (!commits.length) throw new Error('No commits found in repository');
  
  const latestCommit = commits[0];
  
  const run = await prisma.pipelineRun.create({
    data: {
      commitMsg: latestCommit.commit.message,
      commitSha: latestCommit.sha,
      branch: repo.branch || 'main',
      trigger: 'manual',
      repoId: repo.id,
      status: 'QUEUED',
    },
  });

  await pipelineQueue.add('run-pipeline', {
    pipelineId: run.id,
    repoUrl: repo.url,
    commitSha: run.commitSha,
  });

  return run;
}

async function getPipelines(userId, query = {}) {
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const repoIds = repos.map((r) => r.id);
  const { status, branch, page = 1, limit = 20, repoId } = query;
  const where = { repoId: { in: repoIds } };
  
  if (repoId) {
    if (!repoIds.includes(repoId)) throw new Error('Repository not found or access denied');
    where.repoId = repoId;
  }

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
    include: { 
      repository: { select: { name: true, fullName: true, url: true } },
      steps: { orderBy: { startedAt: 'asc' } }
    },
  });
}

async function getPipelineLogs(pipelineId) {
  const steps = await prisma.pipelineStep.findMany({
    where: { pipelineRunId: pipelineId },
    orderBy: { startedAt: 'asc' },
    select: { name: true, logChunk: true, status: true, exitCode: true }
  });
  return steps;
}

async function rerunPipeline(pipelineId) {
  const original = await prisma.pipelineRun.findUnique({ 
    where: { id: pipelineId },
    include: { repository: true } 
  });
  if (!original) throw new Error('Pipeline not found');
  const run = await prisma.pipelineRun.create({
    data: {
      commitMsg: `Re-run: ${original.commitMsg}`,
      commitSha: original.commitSha,
      branch: original.branch,
      trigger: 'manual',
      repoId: original.repoId,
      status: 'QUEUED',
    },
  });

  await pipelineQueue.add('run-pipeline', {
    pipelineId: run.id,
    repoUrl: original.repository.url,
    commitSha: run.commitSha,
  });

  return run;
}

async function getDeployments(userId, query = {}) {
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const repoIds = repos.map((r) => r.id);
  const { status, environment, page = 1, limit = 20, repoId } = query;
  const where = { repoId: { in: repoIds } };
  
  if (repoId) {
    if (!repoIds.includes(repoId)) throw new Error('Repository not found or access denied');
    where.repoId = repoId;
  }

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
  
  const lastPipeline = await prisma.pipelineRun.findFirst({
    where: { repoId, status: 'SUCCESS' },
    orderBy: { startedAt: 'desc' }
  });
  if (!lastPipeline) throw new Error('No successful pipeline run found to deploy');

  const lastDeploy = await prisma.deployment.findFirst({
    where: { repoId },
    orderBy: { createdAt: 'desc' },
  });
  const parts = (lastDeploy?.version || 'v1.0.0').replace('v', '').split('.').map(Number);
  parts[2]++;
  const version = `v${parts.join('.')}`;
  const deployment = await prisma.deployment.create({
    data: {
      version,
      commitSha: lastPipeline.commitSha,
      environment: 'production',
      status: 'QUEUED',
      triggeredBy: 'manual',
      repoId,
    },
  });

  await deploymentQueue.add('run-deployment', {
    deploymentId: deployment.id,
    repoUrl: repo.url,
    commitSha: lastPipeline.commitSha,
  });

  return deployment;
}

async function rollbackDeployment(deploymentId) {
  const currentDeploy = await prisma.deployment.findUnique({ where: { id: deploymentId }});
  if (!currentDeploy) throw new Error('Deployment not found');

  const prevDeploy = await prisma.deployment.findFirst({
    where: { repoId: currentDeploy.repoId, status: 'LIVE', id: { not: deploymentId } },
    orderBy: { createdAt: 'desc' }
  });
  if (!prevDeploy) throw new Error('No previous successful deployment found');
  
  const repo = await prisma.repository.findUnique({ where: { id: currentDeploy.repoId }});

  const rollback = await prisma.deployment.create({
    data: {
      version: `${currentDeploy.version}-rollback`,
      commitSha: prevDeploy.commitSha,
      environment: 'production',
      status: 'QUEUED',
      triggeredBy: 'rollback',
      repoId: currentDeploy.repoId,
    }
  });

  await deploymentQueue.add('run-deployment', {
    deploymentId: rollback.id,
    repoUrl: repo.url,
    commitSha: prevDeploy.commitSha,
  });

  return rollback;
}

async function getSecurityScans(userId, query = {}) {
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const repoIds = repos.map((r) => r.id);
  const { status, scanType, page = 1, limit = 20, repoId } = query;
  const where = { repoId: { in: repoIds } };
  
  if (repoId) {
    if (!repoIds.includes(repoId)) throw new Error('Repository not found or access denied');
    where.repoId = repoId;
  }

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
  getPipelineLogs,
  triggerPipeline,
};
