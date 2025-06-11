const express = require('express');
const metricsController = require('../controllers/metrics.controller');

const router = express.Router();

router.get('/latest', metricsController.getLatestMetrics);

module.exports = router;
