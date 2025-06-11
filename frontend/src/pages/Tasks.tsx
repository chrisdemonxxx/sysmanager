import { useEffect, useState } from 'react';
import request from '../axios';

interface Task {
  id: number;
  name: string;
  command: string;
  runAt: string;
  status: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [runAt, setRunAt] = useState('* * * * *');

  const load = async () => {
    const res = await request({ url: 'tasks', method: 'GET' });
    setTasks(res.data.tasks);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await request({ url: 'tasks', method: 'POST', data: { name, command, runAt } });
    setName(''); setCommand('');
    load();
  };

  const remove = async (id: number) => {
    await request({ url: `tasks/${id}`, method: 'DELETE' });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <form onSubmit={submit} className="mb-4 space-x-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="border px-2 py-1" />
        <input value={command} onChange={e=>setCommand(e.target.value)} placeholder="Command" className="border px-2 py-1" />
        <input value={runAt} onChange={e=>setRunAt(e.target.value)} placeholder="Cron" className="border px-2 py-1" />
        <button className="px-3 py-1 border rounded" type="submit">Add</button>
      </form>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr><th className="px-2">Name</th><th className="px-2">Command</th><th className="px-2">Schedule</th><th></th></tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map(t => (
            <tr key={t.id}>
              <td className="px-2 py-1">{t.name}</td>
              <td className="px-2 py-1">{t.command}</td>
              <td className="px-2 py-1">{t.runAt}</td>
              <td className="px-2 py-1"><button onClick={()=>remove(t.id)} className="text-red-500">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
