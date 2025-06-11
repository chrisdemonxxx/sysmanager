import React, { useEffect, useState } from 'react';
import request from '../axios';
import { UserInfo } from '../types/types';

interface Props {
  user: UserInfo;
  isOpen: boolean;
  onClose: () => void;
}

interface ResponseItem {
  output: string;
  timestamp: number;
}

const CommandOutputViewer: React.FC<Props> = ({ user, isOpen, onClose }) => {
  const [responses, setResponses] = useState<ResponseItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchData() {
      const res = await request({
        url: 'command/responses',
        method: 'GET',
        params: { ipAddress: user.ipAddress, computerName: user.computerName },
      });
      setResponses(res.data.data || []);
    }
    fetchData();
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Command Output</h2>
        <div className="mb-4 overflow-y-auto max-h-60 bg-gray-100 p-2 rounded">
          {responses.map((r, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-xs text-gray-500">{new Date(r.timestamp).toLocaleString()}</div>
              <pre className="whitespace-pre-wrap">{r.output}</pre>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CommandOutputViewer;
