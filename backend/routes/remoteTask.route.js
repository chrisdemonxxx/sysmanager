const express = require('express');
const controller = require('../controllers/remoteTask.controller');
const { authenticate } = require('../configs/auth.middleware');
const router = express.Router();

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.list);

module.exports = router;
