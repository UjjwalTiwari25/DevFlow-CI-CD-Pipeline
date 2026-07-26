const {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} = require('../../src/utils/validators');

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate a correct registration payload', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      const result = registerSchema.parse(data);

      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });

    it('should reject an invalid email', () => {
      const data = {
        email: 'not-an-email',
        password: 'Password123',
        name: 'Test User',
      };

      expect(() => registerSchema.parse(data)).toThrow();
    });

    it('should reject a weak password', () => {
      const data = {
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      };

      expect(() => registerSchema.parse(data)).toThrow();
    });

    it('should reject a password without uppercase', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      expect(() => registerSchema.parse(data)).toThrow();
    });

    it('should reject an empty name', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'A',
      };

      expect(() => registerSchema.parse(data)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should validate a correct login payload', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = loginSchema.parse(data);

      expect(result.email).toBe('test@example.com');
    });

    it('should reject missing password', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => loginSchema.parse(data)).toThrow();
    });
  });

  describe('createTaskSchema', () => {
    it('should validate a minimal task', () => {
      const data = { title: 'My Task' };

      const result = createTaskSchema.parse(data);

      expect(result.title).toBe('My Task');
      expect(result.priority).toBe('MEDIUM');
      expect(result.description).toBe('');
    });

    it('should validate a full task', () => {
      const data = {
        title: 'My Task',
        description: 'A detailed description',
        priority: 'HIGH',
        dueDate: '2025-12-31T00:00:00.000Z',
      };

      const result = createTaskSchema.parse(data);

      expect(result.title).toBe('My Task');
      expect(result.priority).toBe('HIGH');
      expect(result.dueDate).toBeInstanceOf(Date);
    });

    it('should reject an empty title', () => {
      expect(() => createTaskSchema.parse({ title: '' })).toThrow();
    });

    it('should reject an invalid priority', () => {
      expect(() => createTaskSchema.parse({ title: 'Task', priority: 'INVALID' })).toThrow();
    });
  });

  describe('updateTaskSchema', () => {
    it('should validate partial updates', () => {
      const data = { status: 'DONE' };

      const result = updateTaskSchema.parse(data);

      expect(result.status).toBe('DONE');
    });

    it('should reject invalid status', () => {
      expect(() => updateTaskSchema.parse({ status: 'INVALID' })).toThrow();
    });
  });

  describe('taskQuerySchema', () => {
    it('should provide defaults for an empty query', () => {
      const result = taskQuerySchema.parse({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.sortBy).toBe('createdAt');
      expect(result.order).toBe('desc');
    });

    it('should validate custom query params', () => {
      const data = {
        page: '2',
        limit: '10',
        status: 'TODO',
        priority: 'HIGH',
        sortBy: 'dueDate',
        order: 'asc',
      };

      const result = taskQuerySchema.parse(data);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.status).toBe('TODO');
    });

    it('should reject a negative page number', () => {
      expect(() => taskQuerySchema.parse({ page: '-1' })).toThrow();
    });

    it('should reject limit above 100', () => {
      expect(() => taskQuerySchema.parse({ limit: '200' })).toThrow();
    });
  });
});
