// pages/student/StudentDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle, XCircle, PlusCircle, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import ComplaintCard from '../../components/ComplaintCard';
import Loader, { SkeletonCard } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/complaints/my?limit=5')
      .then((res) => setComplaints(res.data.complaints))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {user?.hostel} · Block {user?.block} · Room {user?.roomNumber}
          </p>
        </div>
        <Link to="/student/complaints/new" className="btn-primary shrink-0">
          <PlusCircle size={18} /> New Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Complaints" value={counts.total} icon={ClipboardList} color="bg-primary-500" />
        <StatCard label="Pending" value={counts.pending} icon={Clock} color="bg-yellow-500" />
        <StatCard label="In Progress" value={counts.inProgress} icon={TrendingUp} color="bg-blue-500" />
        <StatCard label="Resolved" value={counts.resolved} icon={CheckCircle} color="bg-green-500" />
      </div>

      {/* Recent complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Recent Complaints</h2>
          <Link to="/student/complaints" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No complaints yet"
            description="Start by filing your first complaint. We'll help resolve it quickly!"
            action={
              <Link to="/student/complaints/new" className="btn-primary inline-flex items-center gap-2 mt-2">
                <PlusCircle size={18} /> File First Complaint
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
