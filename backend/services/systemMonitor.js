const si = require('systeminformation');

let latestMetrics = {};
let listeners = [];
let intervalId;

async function collect() {
  try {
    const [cpu, mem, disk, net] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats()
    ]);
    latestMetrics = {
      timestamp: Date.now(),
      cpu: { usage: parseFloat(cpu.currentLoad.toFixed(1)) },
      memory: {
        used: parseFloat((mem.active / 1073741824).toFixed(1)),
        total: parseFloat((mem.total / 1073741824).toFixed(1))
      },
      disk: {
        used: parseFloat((disk[0].used / 1073741824).toFixed(1)),
        total: parseFloat((disk[0].size / 1073741824).toFixed(1))
      },
      network: {
        tx: parseFloat((net[0].tx_sec / 1024).toFixed(1)),
        rx: parseFloat((net[0].rx_sec / 1024).toFixed(1))
      }
    };
    listeners.forEach(fn => fn(latestMetrics));
  } catch (err) {
    console.error('System metrics collection failed', err);
  }
}

function start(interval = 2000) {
  clearInterval(intervalId);
  collect();
  intervalId = setInterval(collect, interval);
}

function subscribe(fn) {
  listeners.push(fn);
}

function getLatest() {
  return latestMetrics;
}

module.exports = { start, subscribe, getLatest };
