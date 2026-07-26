/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom

jest.mock('next/router', () => require('next-router-mock'));

// jsdom's Web Crypto stub does not implement crypto.randomUUID (unlike Node 24
// and real browsers in secure contexts), which src/services/Logger.js relies
// on. Polyfill it from Node's crypto so the test env matches production.
if (typeof globalThis.crypto?.randomUUID !== 'function') {
  const { randomUUID } = require('crypto');
  globalThis.crypto.randomUUID = randomUUID;
}
