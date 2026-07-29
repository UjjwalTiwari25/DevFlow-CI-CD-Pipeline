const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const runs = await prisma.pipelineRun.findMany({ orderBy: { startedAt: 'desc' }, take: 10 });
  console.log('--- PIPELINE RUNS ---');
  console.log(runs.map(r => ({ id: r.id, commit: r.commitMsg, status: r.status, trigger: r.trigger })));
  
  const steps = await prisma.pipelineStep.findMany({ orderBy: { startedAt: 'desc' }, take: 5 });
  console.log('--- PIPELINE STEPS ---');
  console.log(steps);
}
main().finally(() => prisma.$disconnect());
