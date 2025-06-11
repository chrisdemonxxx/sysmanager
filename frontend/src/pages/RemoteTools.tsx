import { useEffect, useState } from 'react';
import request from '../axios';

interface Proc {
  pid: number;
  name: string;
}

interface FileItem {
  name: string;
  isDir: boolean;
  size: number;
}

export default function RemoteTools() {
  const [image, setImage] = useState('');
  const [processes, setProcesses] = useState<Proc[]>([]);
  const [path, setPath] = useState('.');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [security, setSecurity] = useState<string[]>([]);

  const fetchScreenshot = async () => {
    const res = await request({ url: 'remote/screenshot', method: 'GET' });
    setImage(res.data.data);
  };

  const fetchProcesses = async () => {
    const res = await request({ url: 'remote/processes', method: 'GET' });
    setProcesses(res.data.data || []);
  };

  const killProcess = async (pid: number) => {
    await request({ url: `remote/processes/${pid}`, method: 'DELETE' });
    fetchProcesses();
  };

  const fetchFiles = async () => {
    const res = await request({ url: 'remote/files', method: 'GET', params: { path } });
    setFiles(res.data.files || []);
  };

  const deleteFile = async (name: string) => {
    await request({ url: 'remote/files', method: 'DELETE', params: { path: `${path}/${name}` } });
    fetchFiles();
  };

  const fetchSecurity = async () => {
    const res = await request({ url: 'remote/security', method: 'GET' });
    setSecurity(res.data.software || []);
  };

  useEffect(() => {
    fetchProcesses();
    fetchFiles();
    fetchSecurity();
  }, [path]);

  return (
    <div className="space-y-4">
      <button className="px-2 py-1 border" onClick={fetchScreenshot}>Capture Screenshot</button>
      {image && <img src={`data:image/png;base64,${image}`} alt="screenshot" className="max-w-full" /> }

      <h2 className="font-bold">Processes</h2>
      <ul className="space-y-1">
        {processes.map(p => (
          <li key={p.pid}>
            {p.name} ({p.pid})
            <button className="ml-2 text-red-500" onClick={() => killProcess(p.pid)}>Kill</button>
          </li>
        ))}
      </ul>

      <h2 className="font-bold mt-4">File Explorer</h2>
      <input className="border px-1" value={path} onChange={e => setPath(e.target.value)} />
      <ul className="space-y-1">
        {files.map(f => (
          <li key={f.name}>
            {f.isDir ? '📁' : '📄'} {f.name}
            {!f.isDir && (
              <>
                <a className="ml-2 text-blue-600" href={`/api/v1/remote/download?path=${encodeURIComponent(path + '/' + f.name)}`}>Download</a>
                <button className="ml-2 text-red-500" onClick={() => deleteFile(f.name)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="font-bold mt-4">Security Software</h2>
      <ul className="list-disc pl-4">
        {security.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
