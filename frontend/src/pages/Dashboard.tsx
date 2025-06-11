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
