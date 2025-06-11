import { useState } from 'react';
import request from './axios';
import { useWebSocket } from './hooks/useWebSocket';
import TransferModal from './components/TransferModal';
import UserTable from './components/UserTable';
import SystemAnalytics from './components/SystemAnalytics';
import { UserInfo } from './types/types';

import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Logs from './pages/Logs';


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
