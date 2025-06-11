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
          setHistory((prev) => [...prev.slice(-29), msg.payload]); // Keep last 30 points
        }
      } catch (e) {
        console.error('WebSocket parse error:', e);
      }
    };

    ws.onclose = () => setTimeout(connect, 1000); // Auto-reconnect
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { data, history };
}
