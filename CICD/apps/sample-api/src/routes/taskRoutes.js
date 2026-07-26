const { Router } = require('express');
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createTaskSchema, updateTaskSchema, taskQuerySchema } = require('../utils/validators');

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', validate(taskQuerySchema, 'query'), taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
