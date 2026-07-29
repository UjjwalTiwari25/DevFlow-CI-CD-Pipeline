const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const runs = await prisma.pipelineRun.findMany({ 
    where: { repository: { ownerId: 'b35f329d-6c60-408f-af5b-87d033aa401b' } },
    select: { id: true, status: true, trigger: true, duration: true }
  });
  console.log('RUNS:', runs);
  const deploys = await prisma.deployment.findMany({
    where: { repository: { ownerId: 'b35f329d-6c60-408f-af5b-87d033aa401b' } }
  });
  console.log('DEPLOYS:', deploys);
}
main().finally(() => prisma.$disconnect());
