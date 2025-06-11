import React from 'react';
import { Task } from '../types/types';

interface Props {
  tasks: Task[];
  onCancel: (id: string) => void;
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-200 text-yellow-800',
  running: 'bg-blue-200 text-blue-800',
  completed: 'bg-green-200 text-green-800',
  failed: 'bg-red-200 text-red-800'
};

const TaskTable: React.FC<Props> = ({ tasks, onCancel }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 mt-6">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Command</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tasks.map(t => (
          <tr key={t.id}>
            <td className="px-4 py-2 text-sm">{t.name}</td>
            <td className="px-4 py-2 text-sm">{t.command}</td>
            <td className="px-4 py-2 text-sm">
              <span className={`px-2 py-1 rounded text-xs ${statusColor[t.status]}`}>{t.status}</span>
            </td>
            <td className="px-4 py-2 text-sm">
              {t.status === 'running' && (
                <button className="text-red-600" onClick={() => onCancel(t.id)}>Cancel</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
