import React, { useEffect, useRef, useState } from 'react';
import APP_CONFIG from '../config';
import request from '../axios';
import { Card, CardContent } from './ui/card';
import ChartCard from './ChartCard';

interface Client {
  ipAddress: string;
  computerName: string;
  lastActiveTime: string;
  status: 'online' | 'offline';
}

interface MetricsPayload {
  ipAddress?: string;
  computerName?: string;
  cpu: { currentload: number } | { usage: number };
  mem: { total: number; free: number; used?: number } | { total: number; used: number };
  disk: { rIO: number; wIO: number }; // bytes/sec
  network: { rx_sec: number; tx_sec: number } | { tx: number; rx: number };
}

interface CommandOutput {
  ipAddress: string;
  computerName: string;
  output: string;
}

const SEP = 'sep-x8jmjgfmr9';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export default function RealtimeSystemDashboard() {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [clients, setClients] = useState<Client[]>([]);
  const [offlineClients, setOfflineClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [metricsMap, setMetricsMap] = useState<Record<string, MetricsPayload>>({});
  const [historyMap, setHistoryMap] = useState<Record<string, MetricsPayload[]>>({});
  const [cmd, setCmd] = useState('');
  const [outputs, setOutputs] = useState<CommandOutput[]>([]);
  const MAX_OUTPUTS = 20;

  const key = (c: { ipAddress?: string; computerName?: string }) => `${c.ipAddress || ''}_${c.computerName || ''}`;

  const loadClients = async () => {
    try {
      const res = await request({ url: 'info/get-user-list', method: 'POST' });
      setClients((res.data.online || []).map((c: any) => ({ ...c, status: 'online' })));
      setOfflineClients((res.data.offline || []).map((c: any) => ({ ...c, status: 'offline' })));
    } catch (e) {
      console.error('Failed to load clients', e);
    }
  };

  const sendCommand = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !selected) return;
    const message = `FROM_WEB_PANEL_COMMAND_REQUEST_${SEP}${cmd}`;
    const payload = { type: 'send_to_client', ipAddress: selected.ipAddress, computerName: selected.computerName, message };
    wsRef.current.send(JSON.stringify(payload));
    setCmd('');
  };

  useEffect(() => {
    loadClients();

    const ws = new WebSocket(APP_CONFIG.WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus('connected');
    ws.onclose = () => setStatus('disconnected');
    ws.onerror = () => setStatus('error');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'system_metrics') {
          const payload: MetricsPayload = data.payload;
          setMetricsMap((m) => ({ ...m, [key(payload)]: payload }));
          setHistoryMap((h) => {
            const k = key(payload);
            const arr = h[k] ? [...h[k].slice(-29), payload] : [payload];
            return { ...h, [k]: arr };
          });
        } else if (data.type === 'command_output') {
          setOutputs((o) => {
            const newArr = [...o, data.payload as CommandOutput];
            return newArr.slice(-MAX_OUTPUTS);
          });
        } else if (data.type === 'stats') {
          loadClients();
        }
      } catch (err) {
        if (event.data === 'reload') loadClients();
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const metrics = selected ? metricsMap[key(selected)] : undefined;
  const history = selected ? historyMap[key(selected)] || [] : [];

  return (
    <div className="flex flex-col md:flex-row h-full gap-4">
      <aside className="md:w-64 space-y-4 p-4 border-r overflow-y-auto">
        <div>
          <h2 className="font-semibold mb-2">Online Clients</h2>
          <ul className="space-y-1">
            {clients.map((c) => (
              <li
                key={key(c)}
                onClick={() => setSelected(c)}
                className={`cursor-pointer px-2 py-1 rounded flex items-center justify-between ${selected && key(selected) === key(c) ? 'bg-blue-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <span>{c.ipAddress} - {c.computerName}</span>
                <span className="h-2 w-2 rounded-full bg-green-500" />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Offline Clients</h2>
          <ul className="space-y-1">
            {offlineClients.map((c) => (
              <li key={key(c)} className="px-2 py-1 flex items-center justify-between text-gray-500">
                <span>{c.ipAddress} - {c.computerName}</span>
                <span className="h-2 w-2 rounded-full bg-red-500" />
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="text-sm text-gray-500">Connection status: {status}</div>
        {!selected ? (
          <div className="text-center text-gray-600">Please select a client</div>
        ) : (
          <>
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-2">Real-time Metrics for {selected.computerName}</h3>
                {metrics ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">CPU Usage</p>
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div style={{ width: `${(metrics.cpu as any).currentload ?? (metrics.cpu as any).usage}%` }} className="h-full bg-blue-600 rounded" />
                      </div>
                      <p className="text-xs mt-1">{((metrics.cpu as any).currentload ?? (metrics.cpu as any).usage).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">RAM Usage</p>
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div
                          style={{ width: `${((metrics.mem as any).used ?? ((metrics.mem as any).total - (metrics.mem as any).free)) / (metrics.mem as any).total * 100}%` }}
                          className="h-full bg-green-600 rounded"
                        />
                      </div>
                      <p className="text-xs mt-1">
                        {formatBytes((metrics.mem as any).used ?? ((metrics.mem as any).total - (metrics.mem as any).free))} / {formatBytes((metrics.mem as any).total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Disk IO</p>
                      <p className="text-xs mt-1">
                        Read: {formatBytes(metrics.disk.rIO)}/s, Write: {formatBytes(metrics.disk.wIO)}/s
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Network IO</p>
                      <p className="text-xs mt-1">
                        Up: {formatBytes((metrics.network.tx_sec ?? metrics.network.tx) || 0)}/s, Down: {formatBytes((metrics.network.rx_sec ?? metrics.network.rx) || 0)}/s
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Waiting for metrics...</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartCard
                title="CPU History"
                data={history.map((h, i) => ({
                  name: String(i),
                  value: (h.cpu as any).currentload ?? (h.cpu as any).usage,
                }))}
              />
              <ChartCard
                title="RAM History"
                data={history.map((h, i) => ({
                  name: String(i),
                  value:
                    (((h.mem as any).used ?? (h.mem as any).total - (h.mem as any).free) /
                      (h.mem as any).total) * 100,
                }))}
              />
              <ChartCard
                title="Disk History"
                data={history.map((h, i) => ({
                  name: String(i),
                  value: h.disk.rIO + h.disk.wIO,
                }))}
              />
              <ChartCard
                title="Network History"
                data={history.map((h, i) => ({
                  name: String(i),
                  value:
                    ((h.network.tx_sec ?? h.network.tx) + (h.network.rx_sec ?? h.network.rx)) /
                    1024,
                }))}
              />
            </div>

            <Card>
              <CardContent>
                <h3 className="font-semibold mb-2">Command Console</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cmd}
                    onChange={(e) => setCmd(e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                    placeholder="Enter command"
                  />
                  <button className="bg-blue-600 text-white px-3 rounded" onClick={sendCommand}>Send Command</button>
                </div>
                <div className="bg-gray-100 p-2 rounded h-40 overflow-y-auto text-sm">
                  {outputs
                    .filter(o => key(o) === (selected ? key(selected) : ''))
                    .map((o, idx) => (
                      <pre key={idx} className="whitespace-pre-wrap mb-2">{o.output}</pre>
                    ))}
                </div>
                <button
                  onClick={() => setOutputs([])}
                  className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded"
                >
                  Clear Output
                </button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
