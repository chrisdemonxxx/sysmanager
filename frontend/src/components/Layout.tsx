import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ReactNode } from 'react';

export default function Layout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="lg:ml-56">
        <Topbar title={title} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
