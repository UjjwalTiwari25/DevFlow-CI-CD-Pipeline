const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const run = await prisma.pipelineRun.findFirst({ where: { status: 'SUCCESS' }, include: { repository: true }});
  if (!run) return;
  
  try {
      const scan = await prisma.securityScan.create({
        data: {
          repoId: run.repository.id,
          pipelineRunId: run.id,
          commitSha: run.commitSha,
          scanType: 'dependency',
          scanner: 'npm-audit',
          status: 'COMPLETED', // Is COMPLETED valid?
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          report: JSON.stringify({ raw: "Mock security audit passed perfectly." }), // Must be a string!
        }
      });
      console.log('scan created:', scan.id);
  } catch (err) {
      console.error('SCAN CRASH:', err);
  }
}
main().finally(() => prisma.$disconnect());
