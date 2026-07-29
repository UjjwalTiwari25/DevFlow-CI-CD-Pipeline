const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { queueEmitter, pipelineQueue } = require('./src/utils/queue');
require('./src/workers/pipelineWorker');

async function main() {
  const run = await prisma.pipelineRun.findFirst({ where: { status: 'SUCCESS' }, include: { repository: true }});
  
  if (!run) { console.log('no run'); return; }
  
  // Re-run the mock deployment block directly to see why it crashes
  try {
      const lastDeploy = await prisma.deployment.findFirst({
        where: { repoId: run.repository.id },
        orderBy: { createdAt: 'desc' },
      });
      console.log('lastDeploy:', lastDeploy);
      const parts = (lastDeploy?.version || 'v1.0.0').replace('v', '').split('.').map(Number);
      parts[2]++;
      const version = `v${parts.join('.')}`;
      console.log('version:', version);
      
      const deployment = await prisma.deployment.create({
        data: {
          version,
          commitSha: run.commitSha,
          environment: 'production',
          status: 'QUEUED',
          triggeredBy: 'auto',
          repoId: run.repository.id,
        },
      });
      console.log('deployment created:', deployment.id);
  } catch (err) {
      console.error('DEPLOYMENT TRIGGER CRASH:', err);
  }
}
main().finally(() => prisma.$disconnect());
