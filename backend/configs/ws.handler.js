const WebSocket = require('ws');
const systemMonitor = require('../services/systemMonitor');
const { getStats } = require('../controllers/stats.controller');

let socketList = [];
let offlineClients = [];
let wss;

function broadcastToWebClients(message) {
    for (let i = 0; i < socketList.length; i++) {
        if (!socketList[i].computerName) {
            socketList[i].send(message);
        }
    }
}

function purgeOffline() {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    offlineClients = offlineClients.filter(c => new Date(c.lastActiveTime).getTime() >= cutoff);
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
                    socketList.splice(i, 1);
                    break;
                }
            }
            offlineClients.push({
                ipAddress: ws.ipAddress,
                computerName: ws.computerName,
                lastActiveTime: ws.lastActiveTime
            });
            purgeOffline();
            sendBroadcastToWebPanel();
        });
    });

    console.log('WebSocket server initialized');
    setInterval(purgeOffline, 60 * 60 * 1000);
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
    ws.lastActiveTime = new Date();
    const decoder = new TextDecoder('utf-8');
    const stringMessage = decoder.decode(messageBuffer);

    if(stringMessage == "reload") {
        return;
    }

    const result = stringMessage.split("sep-x8jmjgfmr9");

    if(result[0] == "FROM_WIN_CLIENT") {
        if(result[1] == "CS_SEND_COMPUTERNAME") {
            ws.computerName = result[2];
        }
    }
}

module.exports = {
    initWebSocketServer,
    socketList,
    offlineClients,
    wss,
    broadcastToWebClients,
    broadcast
};
