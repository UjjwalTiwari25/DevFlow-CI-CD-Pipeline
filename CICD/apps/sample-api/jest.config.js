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
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

module.exports = config;
