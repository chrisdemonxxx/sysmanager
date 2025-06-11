import React, { useEffect, useState } from 'react';
import request from '../axios';
import { useWebSocket } from '../hooks/useWebSocket';
import ClientTable from '../components/ClientTable';
import { ClientInfo } from '../types/types';

export default function ConnectedDevices() {
  const [clients, setClients] = useState<ClientInfo[]>([]);

  const fetchClients = async () => {
    try {
      const res = await request({ url: 'get-user-list', method: 'POST' });
      const list = (res.data.userList ?? []).map((u: any, idx: number) => ({
        id: u.computerName ?? `client-${idx}`,
        ipAddress: u.ipAddress,
        operatingSystem: u.os ?? 'Unknown',
        region: u.country ?? 'Unknown',
        isAdmin: !!u.isAdmin,
        status: u.status ?? 'unknown',
      }));
      setClients(list);
    } catch (err) {
      console.error('Failed to fetch clients', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useWebSocket((msg) => {
    if (msg === 'reload') {
      fetchClients();
    }
  });

  const handleAction = (client: ClientInfo, action: 'test' | 'terminate' | 'remove') => {
    const data = { id: client.id, ipAddress: client.ipAddress };
    let url = '';
    if (action === 'test') url = '/command/ping';
    if (action === 'terminate') url = '/command/disconnect-client';
    if (action === 'remove') url = '/command/remove-client';
    request({ url, method: 'POST', data });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Connected Clients</h1>
      <ClientTable data={clients} onAction={handleAction} />
    </div>
  );
}
