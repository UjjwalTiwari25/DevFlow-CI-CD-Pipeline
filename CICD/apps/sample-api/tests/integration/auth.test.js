const request = require('supertest');
const app = require('../../src/app');
const { prisma } = require('../../src/models/prisma');

// Mock Prisma for integration tests (we don't want to hit a real DB in CI)
jest.mock('../../src/models/prisma', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $disconnect: jest.fn(),
  };

  return { prisma: mockPrisma, disconnectDB: jest.fn() };
});

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$12$hashedpassword'),
  compare: jest.fn(),
}));

const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    const validPayload = {
      email: 'newuser@example.com',
      password: 'Password123',
      name: 'New User',
    };

    it('should register a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'newuser@example.com',
        name: 'New User',
        createdAt: new Date(),
      });

      const res = await request(app).post('/api/auth/register').send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.accessToken).toBeDefined();
      // Refresh token is now in an httpOnly cookie, not the JSON body
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(c => c.startsWith('refreshToken='))).toBe(true);
    });

    it('should reject duplicate email', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: 'newuser@example.com',
      });

      const res = await request(app).post('/api/auth/register').send(validPayload);

      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, password: 'weak' });

      expect(res.status).toBe(400);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app).post('/api/auth/register').send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    const validPayload = {
      email: 'user@example.com',
      password: 'Password123',
    };

    it('should login successfully with valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        password: '$2a$12$hashedpassword',
        createdAt: new Date(),
      });
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app).post('/api/auth/login').send(validPayload);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
      // Refresh token is now in an httpOnly cookie, not the JSON body
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(c => c.startsWith('refreshToken='))).toBe(true);
    });

    it('should reject invalid password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'user@example.com',
        password: '$2a$12$hashedpassword',
      });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post('/api/auth/login').send(validPayload);

      expect(res.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post('/api/auth/login').send(validPayload);

      expect(res.status).toBe(401);
    });
  });
});
