import React, { useMemo, useState } from 'react';
import { UserInfo } from '../types/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Props {
  data: UserInfo[];
  onRowClick: (user: UserInfo) => void;
}

const PAGE_SIZE = 10;

const UserTable: React.FC<Props> = ({ data, onRowClick }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      data.filter(
        (user) =>
          user.ipAddress.includes(search) ||
          user.status.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const formatTime = (value: string) =>
    dayjs(value).isValid() ? dayjs(value).fromNow() : value;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <input
          type="text"
          placeholder="Search by IP or Status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md w-full max-w-xs"
        />
        <p className="text-sm text-gray-600">
          Showing {filtered.length} of {data.length} active clients
        </p>
      </div>

      <div className="overflow-auto rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uptime</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Seen</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick(item)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-4 text-sm flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                    {item.computerName.slice(0, 2).toUpperCase()}
                  </span>
                  {item.computerName}
                </td>
                <td className="px-4 py-4 text-sm">{item.ipAddress}</td>
                <td className="px-4 py-4 text-sm">{item.country}</td>
                <td className="px-4 py-4 text-sm">{item.status}</td>
                <td className="px-4 py-4 text-sm">{formatTime(item.additionalSystemDetails)}</td>
                <td className="px-4 py-4 text-sm">{formatTime(item.lastActiveTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
