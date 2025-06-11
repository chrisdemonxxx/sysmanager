const express = require('express');
const { authenticate } = require('../configs/auth.middleware');
const statsController = require('../controllers/stats.controller');

const router = express.Router();

router.get('/', authenticate, statsController.getStatsAction);

module.exports = router;
