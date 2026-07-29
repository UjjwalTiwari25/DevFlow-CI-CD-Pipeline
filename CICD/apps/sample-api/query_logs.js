const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const steps = await prisma.pipelineStep.findMany({
    where: { status: 'FAILED' },
    orderBy: { startedAt: 'desc' },
    take: 3,
    include: { pipelineRun: true }
  });
  console.log(JSON.stringify(steps.map(s => ({ step: s.name, logChunk: s.logChunk, commitMsg: s.pipelineRun.commitMsg })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
