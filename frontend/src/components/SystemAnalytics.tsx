import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useSystemMetrics } from '../hooks/useSystemMetrics';

export default function SystemAnalytics() {
  const { data, history } = useSystemMetrics();

  if (!data) return <div className="animate-pulse">Loading metrics...</div>;

  const chartData = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString(),
    cpu: h.cpu.usage,
    ram: +(100 * h.memory.used / h.memory.total).toFixed(1),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Tile label="CPU Usage" value={`${data.cpu.usage.toFixed(1)}%`} />
        <Tile label="RAM" value={`${data.memory.used.toFixed(1)}/${data.memory.total.toFixed(1)} GB`} />
        <Tile label="Disk" value={`${data.disk.used.toFixed(1)}/${data.disk.total.toFixed(1)} GB`} />
        <Tile label="Network" value={`RX ${data.network.rx.toFixed(1)} KB/s TX ${data.network.tx.toFixed(1)} KB/s`} />
      </div>
      <LineChart width={600} height={200} data={chartData} className="mx-auto">
        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="cpu" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="ram" stroke="#82ca9d" dot={false} />
      </LineChart>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <motion.div layout className="p-4 bg-white rounded shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </motion.div>
  );
}
