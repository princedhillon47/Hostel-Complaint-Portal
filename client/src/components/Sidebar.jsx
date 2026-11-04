// components/Sidebar.jsx — Dashboard sidebar navigation
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Building2, LayoutDashboard, PlusCircle, List, User,
  ClipboardList, Users, Briefcase, LogOut, ChevronLeft, ChevronRight, Moon, Sun,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';

const studentLinks = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/complaints/new', icon: PlusCircle, label: 'New Complaint' },
  { to: '/student/complaints', icon: List, label: 'My Complaints' },
  { to: '/student/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/complaints', icon: ClipboardList, label: 'All Complaints' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/staff', icon: Briefcase, label: 'Staff' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, toggleDark] = useDarkMode();
  const navigate = useNavigate();
  const links = user?.role === 'admin' || user?.role === 'staff' ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 shrink-0`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-primary-700 dark:text-primary-400">
            <Building2 size={24} />
            <span className="text-sm font-bold leading-tight">Hostel Portal</span>
          </div>
        )}
        {collapsed && <Building2 size={24} className="text-primary-700 dark:text-primary-400 mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : ''}
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <button
          onClick={toggleDark}
          className={`sidebar-link w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Toggle theme' : ''}
        >
          {dark ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
          {!collapsed && <span className="text-sm">{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
