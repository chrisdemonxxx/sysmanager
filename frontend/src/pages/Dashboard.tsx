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

