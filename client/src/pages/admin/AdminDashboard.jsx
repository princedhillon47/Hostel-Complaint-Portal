// pages/admin/AdminDashboard.jsx — Analytics with Recharts
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  ClipboardList, Users, Briefcase, CheckCircle, Clock, TrendingUp, XCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import ComplaintCard from '../../components/ComplaintCard';
import Loader from '../../components/Loader';
import API from '../../api/axios';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6366f1', '#14b8a6', '#ec4899'];

const StatCard = ({ label, value, icon: Icon, colorClass, bgClass }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
      <Icon size={22} className={colorClass} />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value ?? '—'}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then((res) => setStats(res.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of all hostel complaints and activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Complaints" value={stats?.totalComplaints} icon={ClipboardList} bgClass="bg-primary-100 dark:bg-primary-900/30" colorClass="text-primary-600" />
        <StatCard label="Pending" value={stats?.pendingComplaints} icon={Clock} bgClass="bg-yellow-100 dark:bg-yellow-900/30" colorClass="text-yellow-600" />
        <StatCard label="In Progress" value={stats?.inProgressComplaints} icon={TrendingUp} bgClass="bg-blue-100 dark:bg-blue-900/30" colorClass="text-blue-600" />
        <StatCard label="Resolved" value={stats?.resolvedComplaints} icon={CheckCircle} bgClass="bg-green-100 dark:bg-green-900/30" colorClass="text-green-600" />
        <StatCard label="Rejected" value={stats?.rejectedComplaints} icon={XCircle} bgClass="bg-red-100 dark:bg-red-900/30" colorClass="text-red-600" />
        <StatCard label="Total Students" value={stats?.totalStudents} icon={Users} bgClass="bg-purple-100 dark:bg-purple-900/30" colorClass="text-purple-600" />
        <StatCard label="Staff Members" value={stats?.totalStaff} icon={Briefcase} bgClass="bg-indigo-100 dark:bg-indigo-900/30" colorClass="text-indigo-600" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* By category */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Complaints by Category</h3>
          {stats?.byCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.byCategory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-10">No data</p>}
        </div>

        {/* By status pie */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Status Distribution</h3>
          {stats ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: stats.pendingComplaints },
                    { name: 'In Progress', value: stats.inProgressComplaints },
                    { name: 'Resolved', value: stats.resolvedComplaints },
                    { name: 'Rejected', value: stats.rejectedComplaints },
                  ].filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {['#f59e0b', '#3b82f6', '#10b981', '#ef4444'].map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </div>

      {/* Monthly trend */}
      {stats?.monthlyTrend?.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Monthly Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.monthlyTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Total" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent complaints */}
      {stats?.recentComplaints?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Complaints</h3>
          <div className="space-y-3">
            {stats.recentComplaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} basePath="/admin/complaints" />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
