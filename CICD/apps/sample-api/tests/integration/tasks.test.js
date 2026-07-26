const request = require('supertest');
const app = require('../../src/app');
const { prisma } = require('../../src/models/prisma');
const { generateAccessToken } = require('../../src/utils/jwt');

// Mock Prisma
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

describe('Task Endpoints', () => {
  let authToken;
  const userId = 'user-123';
  const userEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = generateAccessToken({ id: userId, email: userEmail });
  });

  const mockTask = {
    id: 'task-001',
    title: 'Test Task',
    description: 'A test task description',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    userId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('GET /api/tasks', () => {
    it('should return paginated tasks for authenticated user', async () => {
      prisma.task.findMany.mockResolvedValue([mockTask]);
      prisma.task.count.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.tasks).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.total).toBe(1);
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      prisma.task.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task', description: 'A test task description' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.task.title).toBe('Test Task');
    });

    it('should reject task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No title' });

      expect(res.status).toBe(400);
    });

    it('should reject task with invalid priority', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Task', priority: 'INVALID' });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update a task', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.update.mockResolvedValue({
        ...mockTask,
        status: 'DONE',
      });

      const res = await request(app)
        .patch('/api/tasks/task-001')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'DONE' });

      expect(res.status).toBe(200);
      expect(res.body.data.task.status).toBe('DONE');
    });

    it('should return 404 for non-existent task', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/tasks/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'DONE' });

      expect(res.status).toBe(404);
    });

    it('should return 403 for task owned by another user', async () => {
      prisma.task.findUnique.mockResolvedValue({
        ...mockTask,
        userId: 'other-user',
      });

      const res = await request(app)
        .patch('/api/tasks/task-001')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'DONE' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.delete.mockResolvedValue(mockTask);

      const res = await request(app)
        .delete('/api/tasks/task-001')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should return 404 for non-existent task', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/tasks/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
});
