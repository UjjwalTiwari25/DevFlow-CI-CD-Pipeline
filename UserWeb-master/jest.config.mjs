// jest.config.mjs
// eslint-disable-next-line import/extensions
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@Tests/(.*)$': '<rootDir>/tests/$1',
    '^@Mocks/(.*)$': '<rootDir>/tests/mocks/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'tests-result/jest', outputName: 'results.xml' },
    ],
  ],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
