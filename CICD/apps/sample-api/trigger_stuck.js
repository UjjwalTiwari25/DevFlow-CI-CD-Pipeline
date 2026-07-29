const { PrismaClient } = require('@prisma/client');
const { pipelineQueue } = require('./src/utils/queue');
const prisma = new PrismaClient();

async function main() {
  const queued = await prisma.pipelineRun.findMany({
    where: { status: 'QUEUED' },
    include: { repository: true }
  });
  
  console.log(`Found ${queued.length} queued pipelines`);
  
  for (const run of queued) {
    console.log(`Adding ${run.id} to Redis`);
    await pipelineQueue.add('run-pipeline', {
      pipelineId: run.id,
      repoUrl: run.repository.url,
      commitSha: run.commitSha,
    });
  }
  console.log('Done!');
}
main().then(() => {
  console.log('Script complete');
  process.exit(0);
}).catch(console.error);
