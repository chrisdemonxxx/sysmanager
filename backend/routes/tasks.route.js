const express = require('express');
const controller = require('../controllers/tasks.controller');
const validateTaskInput = require('../middleware/validateTaskInput');
const { authenticate } = require('../configs/auth.middleware');

const router = express.Router();

router.post('/', authenticate, validateTaskInput, controller.createTask);
router.get('/', authenticate, controller.listTasks);
router.get('/:id', authenticate, controller.getTask);
router.patch('/:id/cancel', authenticate, controller.cancelTask);

module.exports = router;
