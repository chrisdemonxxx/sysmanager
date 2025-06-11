const os = require('os');
const fs = require('fs');

function getStats() {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const cpus = os.cpus();
  const cpuLoad = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((t, n) => t + n, 0);
    return acc + (1 - cpu.times.idle / total);
  }, 0) / cpus.length;
  const disk = fs.statSync('/');
  return {
    memory: { free: freeMem, total: totalMem },
    cpu: { load: cpuLoad },
    disk: { free: disk.blocksFree, total: disk.blocks }
  };
}

exports.getStatsAction = (req, res) => {
  res.json({ status: 'success', data: getStats() });
};

module.exports.getStats = getStats;
