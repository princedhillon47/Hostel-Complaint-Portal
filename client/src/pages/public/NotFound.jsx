// pages/public/NotFound.jsx — 404 page
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-9xl font-black text-primary-200 dark:text-primary-900 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => window.history.back()} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Go Back
        </button>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 justify-center">
          <Home size={18} /> Home Page
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
