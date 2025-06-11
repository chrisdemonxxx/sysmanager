const { logs } = require('../services/persist.service');

function nextId() {
  return logs.length ? Math.max(...logs.map(l => l.id || 0)) + 1 : 1;
}

exports.addLog = (req, res) => {
  const { type, message } = req.body;
  if (!type || !message) return res.status(400).json({ message: 'type and message required' });
  const entry = { id: nextId(), type, message, time: new Date().toISOString() };
  logs.push(entry);
  res.json({ status: 'success', entry });
};

exports.listLogs = (req, res) => {
  const { type } = req.query;
  const filtered = type ? logs.filter(l => l.type === type) : logs;
  res.json({ status: 'success', logs: filtered });
};

exports.deleteLog = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = logs.findIndex(l => l.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  logs.splice(idx, 1);
  res.json({ status: 'success' });
};
