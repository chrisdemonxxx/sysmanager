import React, { useState } from 'react';
import { Sun, Moon, UserCircle, LogOut } from 'lucide-react';

const Topbar: React.FC = () => {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDark((d) => !d);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b dark:border-strokedark bg-white dark:bg-boxdark">
      <h1 className="text-lg font-semibold">SysManager Dashboard</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 hover:text-primary">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <UserCircle size={24} />
        <button className="p-2 hover:text-danger">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
