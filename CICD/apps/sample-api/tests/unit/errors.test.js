const {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} = require('../../src/utils/errors');

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with status code and message', () => {
      const error = new AppError('Something went wrong', 500);

      expect(error.message).toBe('Something went wrong');
      expect(error.statusCode).toBe(500);
      expect(error.status).toBe('error');
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
    });

    it('should set status to "fail" for 4xx errors', () => {
      const error = new AppError('Bad request', 400);

      expect(error.status).toBe('fail');
    });

    it('should accept optional errors array', () => {
      const errors = [{ field: 'email', message: 'Invalid' }];
      const error = new AppError('Validation failed', 400, errors);

      expect(error.errors).toEqual(errors);
    });
  });

  describe('NotFoundError', () => {
    it('should default to 404 status', () => {
      const error = new NotFoundError();

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should accept a custom message', () => {
      const error = new NotFoundError('Task not found');

      expect(error.message).toBe('Task not found');
    });
  });

  describe('UnauthorizedError', () => {
    it('should default to 401 status', () => {
      const error = new UnauthorizedError();

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });
  });

  describe('ForbiddenError', () => {
    it('should default to 403 status', () => {
      const error = new ForbiddenError();

      expect(error.statusCode).toBe(403);
    });
  });

  describe('ValidationError', () => {
    it('should default to 400 status', () => {
      const error = new ValidationError();

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Validation failed');
    });
  });

  describe('ConflictError', () => {
    it('should default to 409 status', () => {
      const error = new ConflictError();

      expect(error.statusCode).toBe(409);
    });
  });
});
