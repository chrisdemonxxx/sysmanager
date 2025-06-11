import { useEffect, useState } from 'react';
import APP_CONFIG from '../config';

export interface Metrics {
  cpu: number;
  ram: number;
  disk: number;
  uptime: number;
  history: {
    cpu: number[];
    ram: number[];
  };
}

const initial: Metrics = {
  cpu: 0,
  ram: 0,
  disk: 0,
  uptime: 0,
  history: { cpu: [], ram: [] },
};

export default function useSystemMetrics() {
  const [metrics, setMetrics] = useState<Metrics>(initial);

  useEffect(() => {
    const ws = new WebSocket(APP_CONFIG.WEBSOCKET_URL);

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setMetrics((prev) => ({
          cpu: data.cpu ?? prev.cpu,
          ram: data.ram ?? prev.ram,
          disk: data.disk ?? prev.disk,
          uptime: data.uptime ?? prev.uptime,
          history: {
            cpu: [...prev.history.cpu.slice(-19), data.cpu ?? prev.cpu],
            ram: [...prev.history.ram.slice(-19), data.ram ?? prev.ram],
          },
        }));
      } catch {
        // ignore malformed messages
      }
    };

    return () => ws.close();
  }, []);

  return metrics;
=======
import { useEffect, useRef, useState } from 'react';
import APP_CONFIG from '../config';

export interface SystemMetrics {
  timestamp: number;
  cpu: { usage: number };
  memory: { used: number; total: number };
  disk: { used: number; total: number };
  network: { tx: number; rx: number };
}

export function useSystemMetrics() {
  const [data, setData] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<SystemMetrics[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = () => {
    const ws = new WebSocket(APP_CONFIG.WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'system_metrics') {
          setData(msg.payload);
          setHistory((h) => [...h.slice(-29), msg.payload]);
        }
      } catch (e) {
        console.error('WS parse error', e);
      }
    };

    ws.onclose = () => setTimeout(connect, 1000);
  };

  useEffect(() => {
    connect();
    return () => wsRef.current && wsRef.current.close();
  }, []);

  return { data, history };
}
