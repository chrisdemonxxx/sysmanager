const taskQueue = require('../services/taskQueue');

exports.createTask = (req, res) => {
  const task = taskQueue.addTask({ name: req.body.name, command: req.body.command });
  res.status(201).json({ status: 'success', task });
};

exports.listTasks = (req, res) => {
  res.json({ status: 'success', tasks: Object.values(taskQueue.tasks) });
};

exports.getTask = (req, res) => {
  const task = taskQueue.getTask(req.params.id);
  if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
  res.json({ status: 'success', task });
};

exports.cancelTask = (req, res) => {
  const task = taskQueue.cancelTask(req.params.id);
  if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
  res.json({ status: 'success', task });
};
