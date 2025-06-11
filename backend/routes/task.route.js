const express = require('express');
const { authenticate } = require('../configs/auth.middleware');
const controller = require('../controllers/task.controller');

const router = express.Router();

router.post('/', authenticate, controller.createTask);
router.get('/', authenticate, controller.listTasks);
router.delete('/:id', authenticate, controller.deleteTask);

module.exports = router;
