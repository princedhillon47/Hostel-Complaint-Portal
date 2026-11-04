// App.jsx — React Router v6 setup with role-based protection
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLoader } from './components/Loader';

// Public pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import NewComplaint from './pages/student/NewComplaint';
import StudentComplaints from './pages/student/StudentComplaints';
import ComplaintDetail from './pages/student/ComplaintDetail';
import StudentProfile from './pages/student/StudentProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail';
import AdminStudents from './pages/admin/AdminStudents';
import AdminStaff from './pages/admin/AdminStaff';

// Auto-redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) {
    return <Navigate to={user.role === 'admin' || user.role === 'staff' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

    {/* Student routes */}
    <Route path="/student/dashboard" element={
      <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
    } />
    <Route path="/student/complaints/new" element={
      <ProtectedRoute roles={['student']}><NewComplaint /></ProtectedRoute>
    } />
    <Route path="/student/complaints" element={
      <ProtectedRoute roles={['student']}><StudentComplaints /></ProtectedRoute>
    } />
    <Route path="/student/complaints/:id" element={
      <ProtectedRoute roles={['student']}><ComplaintDetail /></ProtectedRoute>
    } />
    <Route path="/student/profile" element={
      <ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>
    } />

    {/* Admin / Staff routes */}
    <Route path="/admin/dashboard" element={
      <ProtectedRoute roles={['admin', 'staff']}><AdminDashboard /></ProtectedRoute>
    } />
    <Route path="/admin/complaints" element={
      <ProtectedRoute roles={['admin', 'staff']}><AdminComplaints /></ProtectedRoute>
    } />
    <Route path="/admin/complaints/:id" element={
      <ProtectedRoute roles={['admin', 'staff']}><AdminComplaintDetail /></ProtectedRoute>
    } />
    <Route path="/admin/students" element={
      <ProtectedRoute roles={['admin']}><AdminStudents /></ProtectedRoute>
    } />
    <Route path="/admin/staff" element={
      <ProtectedRoute roles={['admin']}><AdminStaff /></ProtectedRoute>
    } />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #111827)',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
