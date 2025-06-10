import { useEffect, useState } from 'react';
import APP_CONFIG from '../config';

export function useWebSocket(onMessage: () => void) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(APP_CONFIG.WEBSOCKET_URL);

    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => {
      if (event.data === 'reload') onMessage();
    };
    ws.onerror = (error) => console.error('WebSocket Error:', error);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, [onMessage]);

  return connected;
}
