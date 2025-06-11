module.exports = function(req, res, next) {
  const { name, command } = req.body;
  if (!name || !command) {
    return res.status(400).json({ status: 'error', message: 'name and command required' });
  }
  const shellSafe = /^[\w.-]+(\s[\w./-]+)*$/;
  if (!shellSafe.test(command) || !shellSafe.test(name)) {
    return res.status(400).json({ status: 'error', message: 'Invalid characters' });
  }
  next();
};
