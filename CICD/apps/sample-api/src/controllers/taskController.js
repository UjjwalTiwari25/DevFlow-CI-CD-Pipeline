const taskService = require('../services/taskService');

/**
 * GET /api/tasks
 */
async function getTasks(req, res, next) {
  try {
    const result = await taskService.getTasks(req.user.id, req.query);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/:id
 */
async function getTask(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);

    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks
 */
async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/tasks/:id
 */
async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/:id
 */
async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
