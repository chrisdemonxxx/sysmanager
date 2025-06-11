const express = require('express');
const commandRoute = require('./command.route');
const infoRoute = require('./info.route');
const statsRoute = require('./stats.route');
const taskRoute = require('./task.route');
const logRoute = require('./log.route');
const userRoute = require('./user.route');

const router = express.Router();

router.use('/command', commandRoute);
router.use('/info', infoRoute);
router.use('/stats', statsRoute);
router.use('/tasks', taskRoute);
router.use('/logs', logRoute);
router.use('/users', userRoute);

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Windows System Management & Deployment Tool APIs',
  });
});

module.exports = router;
