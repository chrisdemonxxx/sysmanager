const bcrypt = require('bcrypt');
const { sign } = require('../configs/auth.middleware');
const { logs } = require('../services/persist.service');

let users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('admin', 10), role: 'admin' }
];

function nextId() {
  return users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

exports.register = async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  if (users.find(u => u.username === username)) return res.status(400).json({ message: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: nextId(), username, password: hash, role };
  users.push(user);
  logs.push({ type: 'auth', message: `User ${username} registered`, time: new Date().toISOString() });
  res.json({ status: 'success', id: user.id });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
  const token = sign({ id: user.id, role: user.role });
  logs.push({ type: 'auth', message: `User ${username} logged in`, time: new Date().toISOString() });
  res.json({ token, role: user.role });
};

exports.listUsers = (req, res) => {
  res.json({ status: 'success', users: users.map(u => ({ id: u.id, username: u.username, role: u.role })) });
};

exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.role = req.body.role || user.role;
  res.json({ status: 'success' });
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  users = users.filter(u => u.id !== id);
  res.json({ status: 'success' });
};
