const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
    .optional()
    .default(''),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  dueDate: z.coerce.date().optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  dueDate: z.coerce.date().optional().nullable(),
});

const taskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
};
