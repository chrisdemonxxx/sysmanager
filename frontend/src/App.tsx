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

      const list = response.data.userList ?? [];
      const filtered = list
        .filter((u: UserInfo) => u.status?.toLowerCase() === 'active')
        .filter((u: UserInfo, i: number, self) =>
          i === self.findIndex(x => x.ipAddress === u.ipAddress)
        );

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Connected Clients</h1>
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
  );
}
