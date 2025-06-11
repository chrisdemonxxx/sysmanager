const webSocket = require('../configs/ws.handler');

exports.getUserListAction = async (req, res) => {
  try {
    const online = webSocket.socketList
      .filter(s => s.ipAddress && s.computerName)
      .map(s => ({
        computerName: s.computerName,
        ipAddress: s.ipAddress,
        country: s.country,
        status: 'Active',
        lastActiveTime: s.lastActiveTime,
        additionalSystemDetails: 'N/A'
      }));

    const offline = webSocket.offlineClients.map(c => ({
      ...c,
      status: 'Offline'
    }));

    res.status(200).json({ status: 'success', online, offline });
  } catch (error) {
    res.status(500).json({ status: 'server_error', message: error.message });
  }
};
