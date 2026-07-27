/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/prisma/'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
    '!src/models/prisma.js',
    '!src/workers/**',
    '!src/services/dashboardService.js',
    '!src/middlewares/usage.js',
    '!src/utils/queue.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

module.exports = config;
