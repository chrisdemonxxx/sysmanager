const express = require('express');
const controller = require('../controllers/tasks.controller');
const validateTaskInput = require('../middleware/validateTaskInput');

const router = express.Router();

router.post('/', validateTaskInput, controller.createTask);
router.get('/', controller.listTasks);
router.get('/:id', controller.getTask);
router.patch('/:id/cancel', controller.cancelTask);

module.exports = router;
