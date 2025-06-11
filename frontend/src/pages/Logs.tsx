import { useEffect, useState } from 'react';
import request from '../axios';

interface Log { id: number; type: string; message: string; time: string; }

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [type, setType] = useState('');

  const load = async () => {
    const res = await request({ url: `logs${type?`?type=${type}`:''}`, method: 'GET' });
    setLogs(res.data.logs);
  };

  const remove = async (id: number) => {
    await request({ url: `logs/${id}`, method: 'DELETE' });
    load();
  };

  useEffect(() => { load(); }, [type]);

  return (
    <div className="p-4">
      <select value={type} onChange={e=>setType(e.target.value)} className="border px-2 py-1 mb-2">
        <option value="">All</option>
        <option value="auth">Auth</option>
        <option value="system">System</option>
        <option value="task">Task</option>
      </select>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr><th className="px-2">Time</th><th className="px-2">Type</th><th className="px-2">Message</th><th></th></tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map(l => (
            <tr key={l.id}>
              <td className="px-2 py-1">{l.time}</td>
              <td className="px-2 py-1">{l.type}</td>
              <td className="px-2 py-1">{l.message}</td>
              <td className="px-2 py-1"><button onClick={()=>navigator.clipboard.writeText(l.message)}>Copy</button> <button onClick={()=>remove(l.id)} className="text-red-500 ml-1">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
