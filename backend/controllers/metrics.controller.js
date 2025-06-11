const systemMonitor = require('../services/systemMonitor');

exports.getLatestMetrics = (req, res) => {
  try {
    const data = systemMonitor.getLatest();
    res.json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
