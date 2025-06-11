const remoteManager = require('../services/remoteTaskManager');

exports.create = (req, res) => {
  const { client, action, payload, scheduleType, cronTime } = req.body;
  if (!client || !action) return res.status(400).json({ message: 'client and action required' });
  const task = remoteManager.createTask({ client, action, payload, scheduleType, cronTime });
  res.status(201).json({ status: 'success', task });
};

exports.list = (req, res) => {
  res.json({ status: 'success', tasks: remoteManager.listTasks() });
};
