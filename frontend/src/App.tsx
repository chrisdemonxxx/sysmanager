import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Clients from './pages/Clients';
import ConnectedDevices from './pages/ConnectedDevices';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="clients" element={<Clients />} />
        <Route path="devices" element={<ConnectedDevices />} />
      </Route>
    </Routes>
=======
import Dashboard from './pages/Dashboard';
import ClientManager from './pages/ClientManager';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clients" element={<ClientManager />} />
    </Routes>
=======
import React, { useState, useEffect } from 'react';
import request from './axios';
import { useWebSocket } from './hooks/useWebSocket';
import TransferModal from './components/TransferModal';
import UserTable from './components/UserTable';

import TaskTable from './components/TaskTable';
import { UserInfo, Task } from './types/types';

export default function App() {
  const [tableData, setTableData] = useState<UserInfo[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalStatus, setModalStatus] = useState(false);
  const [user, setUser] = useState<UserInfo>({
    computerName: 'N/A',
    ipAddress: 'N/A',
    country: 'N/A',
    status: 'N/A',
    lastActiveTime: 'N/A',
    additionalSystemDetails: 'N/A',
  });

  const getUserList = async () => {
    try {
      const response = await request({
        url: 'get-user-list',
        method: 'POST',
      });

import SystemAnalytics from './components/SystemAnalytics';
import { UserInfo } from './types/types';

import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Logs from './pages/Logs';




      setTableData(filtered);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await request({ url: 'tasks', method: 'GET' });
      setTasks(res.data.tasks ?? []);
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    }
  };

  const cancelTask = async (id: string) => {
    await request({ url: `tasks/${id}/cancel`, method: 'PATCH' });
  };

  const connected = useWebSocket((data: any) => {
    if (data === 'reload') {
      getUserList();
    }
    if (data?.type === 'task_update') {
      fetchTasks();
    }
  });

  React.useEffect(() => {
    getUserList();
    fetchTasks();
  }, []);

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}


export default function App() {
  return (

    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Connected Clients</h1>
      <SystemAnalytics />
      <UserTable
        data={tableData}
        onRowClick={(u) => {
          setUser(u);
          setModalStatus(true);
        }}
      />
      <TransferModal
        isOpen={modalStatus}
        user={user}
        setIsOpen={setModalStatus}
        handleProcess={(user, type, script) =>
          console.log('[SEND]', user, type, script)
        }
      />
      <h2 className="text-xl font-bold mb-4 mt-6">Tasks</h2>
      <TaskTable tasks={tasks} onCancel={cancelTask} />
    </div>

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>

  );
}
