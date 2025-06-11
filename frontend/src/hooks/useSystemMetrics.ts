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
