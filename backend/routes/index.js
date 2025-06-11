const express = require('express');
const commandRoute = require('./command.route');
const infoRoute = require('./info.route');
const metricsRoute = require('./metrics.route');

const router = express.Router();

router.use('/command', commandRoute);
router.use('/info', infoRoute);
router.use('/metrics', metricsRoute);

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Windows System Management & Deployment Tool APIs',
  });
});

module.exports = router;
