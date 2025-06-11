const express = require('express');
const commandController = require('../controllers/command.controller');

const router = express.Router();

// POST: Send a script to a specific client
router.post('/send-script-to-client', commandController.sendScriptToClientAction);
router.post('/send', commandController.sendScriptToClientAction);

// GET: Get command responses for a client
router.get('/responses', commandController.getCommandResponses);

// POST: Ping all connected clients
router.post('/ping-all', commandController.pingAll);

// Default API endpoint
router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Command APIs' });
});

module.exports = router;
