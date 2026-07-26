const { generateAccessToken, generateRefreshToken, verifyToken } = require('../../src/utils/jwt');

// Mock the config to use a test secret
jest.mock('../../src/config', () => ({
  config: {
    JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-characters',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
  },
}));

describe('JWT Utilities', () => {
  const testPayload = { id: 'user-123', email: 'test@example.com' };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include the payload in the token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken({ id: testPayload.id });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include the user ID in the token', () => {
      const token = generateRefreshToken({ id: testPayload.id });
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(testPayload.id);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should throw on an invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should throw on a tampered token', () => {
      const token = generateAccessToken(testPayload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => verifyToken(tamperedToken)).toThrow();
    });
  });
});
