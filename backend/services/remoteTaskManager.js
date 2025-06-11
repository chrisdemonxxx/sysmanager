const cron = require('node-cron');
const webSocket = require('../configs/ws.handler');

class RemoteTaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  createTask({ client, action, payload, scheduleType = 'one-time', cronTime = '*' }) {
    const id = this.nextId++;
    const task = { id, client, action, payload, scheduleType, cronTime, status: 'pending' };

    const send = () => {
      const message = JSON.stringify({ type: 'remote_task', payload: { action, data: payload } });
      webSocket.sendToClient(client.ipAddress, client.computerName, message);
      task.status = 'sent';
    };

    if (scheduleType === 'recurring') {
      task.job = cron.schedule(cronTime, send);
    } else {
      task.job = cron.schedule(cronTime, () => {
        send();
        task.job.stop();
        task.status = 'completed';
      });
    }

    this.tasks.push(task);
    return task;
  }

  listTasks() {
    return this.tasks.map(t => ({ ...t, job: undefined }));
  }
}

module.exports = new RemoteTaskManager();
