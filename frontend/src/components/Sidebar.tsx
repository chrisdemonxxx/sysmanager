import { Home, ListTodo, Users, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-56 bg-white dark:bg-gray-900 border-r hidden lg:block">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
        SysManager
      </div>
      <nav className="py-4 px-2 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 w-full">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </nav>
    </aside>
  );
}
