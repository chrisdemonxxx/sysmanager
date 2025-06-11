import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatMsg {
  timestamp: number;
  cpu: number;
  mem: number;
  disk: number;
}

export default function StatsDashboard() {
  const [history, setHistory] = useState<StatMsg[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'stats') {
          setHistory(h => [...h.slice(-59), { timestamp: Date.now(), cpu: data.data.cpu.load, mem: (data.data.memory.free / data.data.memory.total), disk: data.data.disk.free / data.data.disk.total }]);
        }
      } catch {}
    };
    return () => ws.close();
  }, []);

  const latest = history[history.length - 1] || { cpu: 0, mem: 0, disk: 0 };

  const chartData = history.map(h => ({ time: new Date(h.timestamp).toLocaleTimeString(), cpu: Math.round(h.cpu * 100) }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3>CPU</h3>
          <p className="text-2xl font-bold animate-pulse">{Math.round(latest.cpu * 100)}%</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3>RAM</h3>
          <p className="text-2xl font-bold animate-pulse">{Math.round(latest.mem * 100)}%</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3>Disk</h3>
          <p className="text-2xl font-bold animate-pulse">{Math.round(latest.disk * 100)}%</p>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" tick={false} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cpu" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
