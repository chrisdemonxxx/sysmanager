const express = require('express');
const { authenticate } = require('../configs/auth.middleware');
const { authorize } = require('../configs/role.middleware');
const controller = require('../controllers/log.controller');

const router = express.Router();

router.get('/', authenticate, controller.listLogs);
router.post('/', authenticate, controller.addLog);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteLog);

module.exports = router;
