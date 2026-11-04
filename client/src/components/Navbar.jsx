// components/Navbar.jsx — Public top navigation bar
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Menu, Moon, Sun, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate(user?.role === 'admin' || user?.role === 'staff' ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-700 dark:text-primary-400">
            <Building2 size={28} />
            <span className="hidden sm:block">Hostel Portal</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium text-sm transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium text-sm transition-colors">How It Works</a>
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <button onClick={handleDashboard} className="btn-primary text-sm">
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4 space-y-3">
          <a href="#features" className="block text-gray-600 dark:text-gray-300 py-1">Features</a>
          <a href="#how-it-works" className="block text-gray-600 dark:text-gray-300 py-1">How It Works</a>
          {user ? (
            <button onClick={handleDashboard} className="btn-primary w-full justify-center">Dashboard</button>
          ) : (
            <>
              <Link to="/login" className="block text-center text-primary-600 font-semibold py-2 border border-primary-600 rounded-lg">Login</Link>
              <Link to="/register" className="btn-primary w-full justify-center">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
