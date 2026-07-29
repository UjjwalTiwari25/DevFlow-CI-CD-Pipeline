const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const repoIds = (await prisma.repository.findMany()).map(r => r.id);
  const totalRuns = await prisma.pipelineRun.count({ where: { repoId: { in: repoIds } } });
  const successRuns = await prisma.pipelineRun.count({ where: { repoId: { in: repoIds }, status: 'SUCCESS' } });
  const deploysToday = await prisma.deployment.count({ where: { repoId: { in: repoIds } } });
  
  console.log({ totalRuns, successRuns, deploysToday });
}
main().finally(() => prisma.$disconnect());
