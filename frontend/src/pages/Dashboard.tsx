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
  );
}
