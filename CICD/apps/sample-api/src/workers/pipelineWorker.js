const { Worker } = require('bullmq');
const { connection } = require('../utils/queue');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// ─── Input Validation ────────────────────────────────────────────────────────
// Validates that a commit SHA is exactly 40 hex characters (full SHA-1)
const COMMIT_SHA_REGEX = /^[a-f0-9]{40}$/;
// Validates that a repo URL matches a GitHub HTTPS clone URL pattern
const REPO_URL_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;

function validatePipelineInputs(repoUrl, commitSha) {
  if (!COMMIT_SHA_REGEX.test(commitSha)) {
    throw new Error(
      `Invalid commit SHA: must be 40 hex characters, got "${String(commitSha).substring(0, 50)}"`
    );
  }
  if (!REPO_URL_REGEX.test(repoUrl)) {
    throw new Error(
      `Invalid repository URL: must be a GitHub HTTPS URL, got "${String(repoUrl).substring(0, 100)}"`
    );
  }
}

// ─── Build Script ────────────────────────────────────────────────────────────
// The build script is a static template — repo URL and commit SHA are passed
// as environment variables, NEVER interpolated into the shell string.
const BUILD_SCRIPT = `
set -euo pipefail
apk add --no-cache git
git clone "$REPO_URL.git" /app
cd /app
git checkout "$COMMIT_SHA"
if [ -f "frontend/package.json" ]; then
  cd frontend
  npm install
  npm run build
elif [ -f "package.json" ]; then
  npm install
fi
echo "Build completed successfully."
`;

const pipelineWorker = new Worker(
  'pipeline-queue',
  async (job) => {
    const { pipelineId, repoUrl, commitSha } = job.data;
    const startTime = Date.now();
    let logs = 'Starting Docker container for pipeline execution...\n\n';

    try {
      // ── Validate inputs BEFORE doing anything ──
      validatePipelineInputs(repoUrl, commitSha);

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: { status: 'RUNNING' },
      });

      logs += 'Pulling node:24-alpine image...\n';
      await new Promise((resolve, reject) => {
        docker.pull('node:24-alpine', (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (err, res) => (err ? reject(err) : resolve(res)));
        });
      });

      logs += 'Creating isolated build container...\n';
      const container = await docker.createContainer({
        Image: 'node:24-alpine',
        // Use array-form Cmd — no shell interpolation of user input
        Cmd: ['sh', '-c', BUILD_SCRIPT],
        Tty: false,
        // Pass untrusted values as environment variables, not shell args
        Env: [`REPO_URL=${repoUrl}`, `COMMIT_SHA=${commitSha}`],
        // ── Container hardening (mitigates #3 — Docker socket risk) ──
        HostConfig: {
          Memory: 512 * 1024 * 1024, // 512 MB max
          MemorySwap: 512 * 1024 * 1024, // No swap
          CpuPeriod: 100000,
          CpuQuota: 50000, // 50% of one CPU
          PidsLimit: 256, // Prevent fork bombs
          ReadonlyRootfs: false, // Builds need to write
          NetworkMode: 'none', // No network access during build
          SecurityOpt: ['no-new-privileges'], // Prevent privilege escalation
          AutoRemove: false, // We remove manually after collecting logs
        },
      });

      await container.start();

      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      stream.on('data', (chunk) => {
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
          logsUrl: logsPath,
        },
      });

      logger.info(
        `Pipeline ${pipelineId} finished inside Docker with status ${buildPassed ? 'SUCCESS' : 'FAILED'}`
      );
    } catch (err) {
      logger.error(`Docker pipeline ${pipelineId} crashed`, { error: err.message });
      logs += `\nError:\n${err.message}`;

      await prisma.pipelineRun.update({
        where: { id: pipelineId },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          duration: Math.floor((Date.now() - startTime) / 1000),
        },
      });
    }
  },
  { connection }
);

pipelineWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} has completed!`);
});

pipelineWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = { pipelineWorker };
