import { Sun, Moon, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Topbar({ title }: { title: string }) {
  const [dark, setDark] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-900 lg:ml-56">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            document.documentElement.classList.toggle('dark');
            setDark(!dark);
          }}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <LogOut className="h-4 w-4" />
        </button>
        <img src="/avatar.png" className="h-8 w-8 rounded-full" />
      </div>
    </header>
  );
}
