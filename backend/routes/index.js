const express = require('express');
const commandRoute = require('./command.route');
const infoRoute = require('./info.route');
const tasksRoute = require('./tasks.route');

const metricsRoute = require('./metrics.route');

const statsRoute = require('./stats.route');
const taskRoute = require('./task.route');
const logRoute = require('./log.route');
const userRoute = require('./user.route');
const remoteTaskRoute = require('./remoteTask.route');


const router = express.Router();

router.use('/command', commandRoute);
router.use('/info', infoRoute);
router.use('/tasks', tasksRoute);

router.use('/metrics', metricsRoute);

router.use('/stats', statsRoute);
router.use('/tasks', taskRoute);
router.use('/logs', logRoute);
router.use('/users', userRoute);
router.use('/remote-tasks', remoteTaskRoute);


router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Windows System Management & Deployment Tool APIs',
  });
});

module.exports = router;
