import React, { useMemo, useState } from 'react';
import sortBy from 'sort-by';
import { ClientInfo } from '../types/types';

interface Props {
  data: ClientInfo[];
  onAction: (client: ClientInfo, action: 'test' | 'terminate' | 'remove') => void;
}

const PAGE_SIZE = 10;

const ClientTable: React.FC<Props> = ({ data, onAction }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof ClientInfo>('ipAddress');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return data
      .filter(
        (c) =>
          c.ipAddress.toLowerCase().includes(term) ||
          c.status.toLowerCase().includes(term) ||
          c.region.toLowerCase().includes(term)
      )
      .sort(sortBy(sortKey));
  }, [data, search, sortKey]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const toggleSort = (key: keyof ClientInfo) => {
    setSortKey(key);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md w-full max-w-xs"
        />
        <p className="text-sm text-gray-600">
          Showing {filtered.length} of {data.length} devices
        </p>
      </div>

      <div className="overflow-auto rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['id','ipAddress','operatingSystem','region','isAdmin','status'].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => toggleSort(col as keyof ClientInfo)}
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm">{c.id}</td>
                <td className="px-4 py-4 text-sm">{c.ipAddress}</td>
                <td className="px-4 py-4 text-sm">{c.operatingSystem}</td>
                <td className="px-4 py-4 text-sm">{c.region}</td>
                <td className="px-4 py-4 text-sm">{c.isAdmin ? 'Yes' : 'No'}</td>
                <td className="px-4 py-4 text-sm">{c.status}</td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => onAction(c, 'test')}
                  >
                    Test
                  </button>
                  <button
                    className="text-yellow-600"
                    onClick={() => onAction(c, 'terminate')}
                  >
                    Terminate
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => onAction(c, 'remove')}
                  >
                    Remove
                  </button>
                </td>
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

export default ClientTable;
