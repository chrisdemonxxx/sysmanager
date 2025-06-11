import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import UserTable from '../components/UserTable';
import request from '../axios';
import { useWebSocket } from '../hooks/useWebSocket';
import toast from 'react-hot-toast';
import useSystemMetrics from '../hooks/useSystemMetrics';
import { Cpu, HardDrive, Timer, MemoryStick } from 'lucide-react';
import { UserInfo } from '../types/types';

export default function Dashboard() {
  const [online, setOnline] = useState<UserInfo[]>([]);
  const [offline, setOffline] = useState<UserInfo[]>([]);
  const [showOffline, setShowOffline] = useState(false);
  const { data, history } = useSystemMetrics();

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

  const pingAll = async () => {
    const toastId = toast.loading('Pinging all clients...');
    try {
      const res = await request({ url: 'command/ping-all', method: 'POST' });
      if (res.status === 200) {
        toast.success('Ping sent', { id: toastId });
      } else {
        toast.error('Failed to ping', { id: toastId });
      }
    } catch (err: any) {
      toast.error('Failed to ping', { id: toastId });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Stats Grid */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="CPU Usage"
            value={data.cpu.usage}
            icon={<Cpu />}
            color="bg-blue-600"
            suffix="%"
          />
          <StatCard
            title="RAM Usage"
            value={((data.memory.used / data.memory.total) * 100)}
            icon={<MemoryStick />}
            color="bg-green-600"
            suffix="%"
          />
          <StatCard
            title="Disk Usage"
            value={((data.disk.used / data.disk.total) * 100)}
            icon={<HardDrive />}
            color="bg-yellow-600"
            suffix="%"
          />
          <StatCard
            title="Uptime (s)"
            value={Math.floor(data.timestamp / 1000)}
            icon={<Timer />}
            color="bg-red-600"
          />
        </div>
      )}

      {/* Chart Section */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard
            title="CPU History"
            data={history.map(h => ({ name: `${h.timestamp}`, value: h.cpu.usage }))}
          />
          <ChartCard
            title="RAM History"
            data={history.map(h => ({
              name: `${h.timestamp}`,
              value: (h.memory.used / h.memory.total) * 100
            }))}
          />
        </div>
      )}

      {/* Bots Table */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setShowOffline(o => !o)}
          className="px-3 py-1 border rounded"
        >
          {showOffline ? 'Show Online' : 'Show Offline'}
        </button>
        <button
          onClick={pingAll}
          className="ml-2 px-3 py-1 border rounded"
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
