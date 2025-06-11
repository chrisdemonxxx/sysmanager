import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${
        open ? 'w-64' : 'w-16'
      } bg-white dark:bg-boxdark border-r dark:border-strokedark min-h-screen transition-all duration-300 fixed md:static z-50`}
    >
      <button
        className="md:hidden p-2"
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>
      <nav className="mt-6 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-boxdark-2 ${
                isActive ? 'font-medium text-primary' : 'text-body'
              }`
            }
            onClick={() => setOpen(false)}
          >
            <Icon size={20} />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
        <button className="flex items-center gap-2 px-4 py-2 text-body hover:bg-gray-200 dark:hover:bg-boxdark-2 w-full">
          <LogOut size={20} />
          {open && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
