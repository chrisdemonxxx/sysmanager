import { Routes, Route, Navigate } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';
import ClientManager from './pages/ClientManager';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clients" element={<ClientManager />} />
    </Routes>
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
import Logs from './pages/Logs';
import Login from './pages/Login';
import Register from './pages/Register';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="clients" element={<Clients />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
