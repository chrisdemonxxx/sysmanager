import { useEffect, useState } from 'react';
import APP_CONFIG from '../config';

export function useWebSocket(onMessage: (data: any) => void) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(APP_CONFIG.WEBSOCKET_URL);

    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        if (event.data === 'reload') onMessage('reload');
      }
    };
    ws.onerror = (error) => console.error('WebSocket Error:', error);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, [onMessage]);

  return connected;
}
