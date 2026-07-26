const { prisma } = require('../models/prisma');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

/**
 * Create a new task for a user.
 * @param {string} userId
 * @param {object} data - { title, description, priority, dueDate }
 * @returns {object} Created task
 */
async function createTask(userId, data) {
  const task = await prisma.task.create({
    data: {
      ...data,
      userId,
    },
  });

  return task;
}

/**
 * Get paginated tasks for a user with optional filters.
 * @param {string} userId
 * @param {object} query - { page, limit, status, priority, sortBy, order, search }
 * @returns {object} { tasks, pagination }
 */
async function getTasks(userId, query) {
  const { page, limit, status, priority, sortBy, order, search } = query;
  const skip = (page - 1) * limit;

  const where = { userId };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

/**
 * Get a single task by ID, verifying ownership.
 * @param {string} taskId
 * @param {string} userId
 * @returns {object} Task
 */
async function getTaskById(taskId, userId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  if (task.userId !== userId) {
    throw new ForbiddenError('You do not have permission to access this task');
  }

  return task;
}

/**
 * Update a task by ID, verifying ownership.
 * @param {string} taskId
 * @param {string} userId
 * @param {object} data - Fields to update
 * @returns {object} Updated task
 */
async function updateTask(taskId, userId, data) {
  // Verify ownership first
  await getTaskById(taskId, userId);

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  return task;
}

/**
 * Delete a task by ID, verifying ownership.
 * @param {string} taskId
 * @param {string} userId
 * @returns {object} Deleted task
 */
async function deleteTask(taskId, userId) {
  // Verify ownership first
  await getTaskById(taskId, userId);

  const task = await prisma.task.delete({
    where: { id: taskId },
  });

  return task;
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
