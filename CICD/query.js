const { PrismaClient } = require('./apps/sample-api/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const runs = await prisma.pipelineRun.findMany({ orderBy: { startedAt: 'desc' }, take: 10 });
  console.log(runs.map(r => ({ id: r.id, commit: r.commitMsg, status: r.status, trigger: r.trigger })));
}
main().finally(() => prisma.$disconnect());
