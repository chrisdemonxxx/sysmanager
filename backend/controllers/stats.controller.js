const os = require('os');
const si = require('systeminformation');

async function getStats() {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const cpus = os.cpus();
  const cpuLoad = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((t, n) => t + n, 0);
    return acc + (1 - cpu.times.idle / total);
  }, 0) / cpus.length;
  const fsInfo = await si.fsSize();
  const diskInfo = fsInfo[0] || { free: 0, size: 0 };
  return {
    memory: { free: freeMem, total: totalMem },
    cpu: { load: cpuLoad },
    disk: { free: diskInfo.size - diskInfo.used, total: diskInfo.size }
  };
}

exports.getStatsAction = (req, res) => {
  getStats()
    .then(data => res.json({ status: 'success', data }))
    .catch(err => {
      console.error('Failed to collect stats', err);
      res.status(500).json({ status: 'error', message: 'Failed to collect stats' });
    });
};

module.exports.getStats = getStats;
