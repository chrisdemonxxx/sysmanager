const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const TASK_FILE = path.join(dataDir, 'tasks.json');
const LOG_FILE = path.join(dataDir, 'logs.json');

function load(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return [];
  }
}

function save(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Persist error:', err.message);
  }
}

const tasks = load(TASK_FILE);
const logs = load(LOG_FILE);

function persist() {
  save(TASK_FILE, tasks);
  save(LOG_FILE, logs);
}

module.exports = {
  tasks,
  logs,
  persist,
};
