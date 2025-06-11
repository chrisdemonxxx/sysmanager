import React from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { Cpu, HardDrive, Timer, MemoryStick } from 'lucide-react';
import useSystemMetrics from '../hooks/useSystemMetrics';

const Dashboard: React.FC = () => {
  const metrics = useSystemMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="CPU Usage"
        value={metrics.cpu}
        icon={<Cpu />}
        color="bg-primary"
      />
      <StatCard
        title="RAM Usage"
        value={metrics.ram}
        icon={<MemoryStick />}
        color="bg-success"
      />
      <StatCard
        title="Disk Usage"
        value={metrics.disk}
        icon={<HardDrive />}
        color="bg-warning"
      />
      <StatCard
        title="Uptime"
        value={metrics.uptime}
        icon={<Timer />}
        color="bg-danger"
      />
      <div className="md:col-span-2">
        <ChartCard title="CPU History" data={metrics.history.cpu} color="#3b82f6" />
      </div>
      <div className="md:col-span-2">
        <ChartCard title="RAM History" data={metrics.history.ram} color="#10b981" />
      </div>
    </div>
  );
};

export default Dashboard;
=======
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { useState, useEffect } from 'react';

function generateData() {
  return Array.from({ length: 60 }, (_, i) => ({ name: String(i), value: Math.random() * 100 }));
}

export default function Dashboard() {
  const [cpu, setCpu] = useState(20);
  const [memory, setMemory] = useState(40);
  const [disk, setDisk] = useState(60);
  const [uptime, setUptime] = useState(3);

  const [cpuData, setCpuData] = useState(generateData());
  const [memData, setMemData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.random() * 100);
      setMemory(Math.random() * 100);
      setDisk(Math.random() * 100);
      setUptime((u) => u + 0.1);
      setCpuData(generateData());
      setMemData(generateData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="CPU Usage" value={cpu} suffix="%" />
        <StatCard title="Memory Usage" value={memory} suffix="%" />
        <StatCard title="Disk Usage" value={disk} suffix="%" />
        <StatCard title="System Uptime" value={uptime} suffix="h" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
        <ChartCard title="CPU Usage (60s)" data={cpuData} />
        <ChartCard title="Memory Usage (60s)" data={memData} />
      </div>
    </Layout>
=======
import { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import StatsDashboard from '../components/StatsDashboard';
import request from '../axios';
import { useWebSocket } from '../hooks/useWebSocket';
import { UserInfo } from '../types/types';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tableData, setTableData] = useState<UserInfo[]>([]);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  const getUserList = async () => {
    const response = await request({ url: 'info/get-user-list', method: 'POST' });
    const list = response.data.userList ?? [];
    setTableData(list);
  };

  const connected = useWebSocket(getUserList);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={"p-4 min-h-screen " + (dark ? 'dark bg-gray-900 text-white' : '')}>
      <div className="flex justify-between items-center mb-4">
        <button className="px-2 py-1 border rounded" onClick={() => setDark(d => !d)}>Toggle {dark ? 'Light' : 'Dark'}</button>
        <button className="px-2 py-1 border rounded" onClick={logout}>Logout</button>
      </div>
      <StatsDashboard />
      <UserTable data={tableData} onRowClick={() => {}} />
    </div>
  );
}

