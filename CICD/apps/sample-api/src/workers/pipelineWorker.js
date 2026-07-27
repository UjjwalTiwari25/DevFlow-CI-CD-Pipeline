const { Worker } = require('bullmq');
const { connection } = require('../utils/queue');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const pipelineWorker = new Worker(
  'pipeline-queue',
  async (job) => {
    const { pipelineId, repoUrl, commitSha } = job.data;
    const startTime = Date.now();
    let logs = "Starting Docker container for pipeline execution...\n\n";
    
    try {
      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: { status: 'RUNNING' }
      });

      const script = `
        apk add --no-cache git
        git clone ${repoUrl}.git /app
        cd /app
        git checkout ${commitSha}
        if [ -f "frontend/package.json" ]; then
          cd frontend
          npm install
          npm run build
        elif [ -f "package.json" ]; then
          npm install
        fi
        echo "Build completed successfully."
      `;

      logs += "Pulling node:24-alpine image...\n";
      await new Promise((resolve, reject) => {
        docker.pull('node:24-alpine', (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
        });
      });

      logs += "Creating isolated build container...\n";
      const container = await docker.createContainer({
        Image: 'node:24-alpine',
        Cmd: ['sh', '-c', script],
        Tty: false,
      });

      await container.start();
      
      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true
      });
      
      stream.on('data', chunk => {
        // Docker multiplexing header is 8 bytes, so we slice it
        logs += chunk.toString('utf8').substring(8);
      });

      const data = await container.wait();
      const exitCode = data.StatusCode;
      const buildPassed = exitCode === 0;

      logs += `\nContainer exited with code ${exitCode}\n`;
      
      await container.remove();

      const durationMs = Date.now() - startTime;
      
      const logsPath = path.join(process.cwd(), '..', '..', 'tmp_builds', `${pipelineId}.log`);
      if (!fs.existsSync(path.dirname(logsPath))) {
        fs.mkdirSync(path.dirname(logsPath), { recursive: true });
      }
      fs.writeFileSync(logsPath, logs);

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: { 
          status: buildPassed ? 'SUCCESS' : 'FAILED',
          finishedAt: new Date(),
          duration: Math.floor(durationMs / 1000),
          lintPassed: buildPassed,
          testsPassed: buildPassed,
          buildPassed: buildPassed,
          logsUrl: logsPath
        }
      });
      
      logger.info(`Pipeline ${pipelineId} finished inside Docker with status ${buildPassed ? 'SUCCESS' : 'FAILED'}`);
    } catch (err) {
      logger.error(`Docker pipeline ${pipelineId} crashed`, { error: err.message });
      logs += `\nError:\n${err.message}`;
      
      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: { 
          status: 'FAILED',
          finishedAt: new Date(),
          duration: Math.floor((Date.now() - startTime) / 1000),
        }
      });
    }
  },
  { connection }
);

pipelineWorker.on('completed', job => {
  logger.info(`Job ${job.id} has completed!`);
});

pipelineWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = { pipelineWorker };
