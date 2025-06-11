import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Clients from './pages/Clients';
import RemoteTools from './pages/RemoteTools';
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
        <Route path="remote" element={<RemoteTools />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
