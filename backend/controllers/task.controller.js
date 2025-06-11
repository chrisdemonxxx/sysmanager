const cron = require('node-cron');
const { tasks, logs } = require('../services/persist.service');
const { exec } = require('child_process');

let nextId = tasks.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1;

exports.createTask = (req, res) => {
  const { name, command, runAt } = req.body;
  if (!name || !command || !runAt) {
    return res.status(400).json({ message: 'name, command and runAt required' });
  }
  const id = nextId++;
  const cronTask = cron.schedule(runAt, () => {
    exec(command, (err) => {
      logs.push({ type: 'task', message: `Task ${name} executed`, error: err ? err.message : null, time: new Date().toISOString() });
    });
  });
  tasks.push({ id, name, command, runAt, cronTask, status: 'scheduled' });
  res.json({ status: 'success', id });
};

exports.listTasks = (req, res) => {
  res.json({ status: 'success', tasks: tasks.map(t => ({ id: t.id, name: t.name, command: t.command, runAt: t.runAt, status: t.status })) });
};

exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  tasks[idx].cronTask.stop();
  tasks.splice(idx, 1);
  res.json({ status: 'success' });
};
