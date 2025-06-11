import { useEffect, useState } from 'react';
import StatsDashboard from '../components/StatsDashboard';
import UserTable from '../components/UserTable';
import request from '../axios';
import { useWebSocket } from '../hooks/useWebSocket';
import { UserInfo } from '../types/types';

export default function Dashboard() {
  const [online, setOnline] = useState<UserInfo[]>([]);
  const [offline, setOffline] = useState<UserInfo[]>([]);
  const [showOffline, setShowOffline] = useState(false);

  const load = async () => {
    try {
      const res = await request({ url: 'info/get-user-list', method: 'POST' });
      setOnline(res.data.online ?? []);
      setOffline(res.data.offline ?? []);
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  };

  useWebSocket((msg) => {
    if (msg === 'reload') load();
  });

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <StatsDashboard />
      <div className="flex justify-end">
        <button
          onClick={() => setShowOffline(o => !o)}
          className="px-3 py-1 border rounded mb-2"
        >
          {showOffline ? 'Show Online' : 'Show Offline'}
        </button>
        <button
          onClick={() => request({ url: 'command/ping-all', method: 'POST' })}
          className="ml-2 px-3 py-1 border rounded mb-2"
        >
          Ping All
        </button>
      </div>
      <UserTable
        data={showOffline ? offline : online}
        onRowClick={() => {}}
      />
    </div>
  );
}
