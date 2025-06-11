const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const FILE = path.join(__dirname, '../data/tasks.json');

class TaskQueue {
  constructor() {
    this.queue = [];
    this.tasks = {};
    this.broadcast = () => {};
    this.load();
    this.processing = false;
  }

  load() {
    try {
      const data = fs.readFileSync(FILE, 'utf-8');
      const tasks = JSON.parse(data);
      tasks.forEach(t => {
        this.tasks[t.id] = t;
        if (t.status === 'pending') this.queue.push(t);
      });
    } catch (err) {
      this.tasks = {};
    }
  }

  save() {
    fs.writeFileSync(FILE, JSON.stringify(Object.values(this.tasks), null, 2));
  }

  addTask({ name, command }) {
    const id = Date.now().toString();
    const task = {
      id,
      name,
      command,
      status: 'pending',
      stdout: '',
      stderr: '',
      exitCode: null,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
    };
    this.tasks[id] = task;
    this.queue.push(task);
    this.save();
    this.broadcast({ type: 'task_update', payload: { task } });
    return task;
  }

  getTask(id) {
    return this.tasks[id];
  }

  cancelTask(id) {
    const task = this.tasks[id];
    if (!task) return null;
    if (task.status === 'running' && task.process) {
      task.process.kill();
    } else if (task.status === 'pending') {
      this.queue = this.queue.filter(t => t.id !== id);
    }
    task.status = 'failed';
    task.completedAt = new Date().toISOString();
    delete task.process;
    this.save();
    this.broadcast({ type: 'task_update', payload: { task } });
    return task;
  }

  processNext() {
    if (this.processing) return;
    const task = this.queue.shift();
    if (!task) return;
    this.processing = true;
    task.status = 'running';
    task.startedAt = new Date().toISOString();
    const child = spawn(task.command, { shell: true });
    task.process = child;
    this.broadcast({ type: 'task_update', payload: { task } });
    this.save();

    child.stdout.on('data', chunk => {
      task.stdout += chunk.toString();
    });
    child.stderr.on('data', chunk => {
      task.stderr += chunk.toString();
    });

    child.on('close', code => {
      task.exitCode = code;
      task.completedAt = new Date().toISOString();
      task.status = code === 0 ? 'completed' : 'failed';
      delete task.process;
      this.processing = false;
      this.save();
      this.broadcast({ type: 'task_update', payload: { task } });
    });
  }

  start(interval = 1000) {
    setInterval(() => this.processNext(), interval);
  }

  setBroadcastHandler(fn) {
    this.broadcast = fn;
  }
}

module.exports = new TaskQueue();
