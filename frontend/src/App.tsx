import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientManager from './pages/ClientManager';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clients" element={<ClientManager />} />
    </Routes>
  );
}
