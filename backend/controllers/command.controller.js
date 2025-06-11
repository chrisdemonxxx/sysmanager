const webSocket = require('../configs/ws.handler');

exports.sendScriptToClientAction = async (req, res) => {
  try {
    const { user, type, script } = req.body;
    const SEP = 'sep-x8jmjgfmr9';
    webSocket.socketList.forEach(socket => {
      if (socket.ipAddress === user.ipAddress && socket.computerName === user.computerName) {
        const message = `FROM_SERVER${SEP}${type}${SEP}${script}`;
        socket.send(message);
      }
    });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'server_error', message: error.message });
  }
};

exports.pingAll = (req, res) => {
  try {
    webSocket.socketList.forEach(s => {
      try { s.send('ping'); } catch {}
    });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
