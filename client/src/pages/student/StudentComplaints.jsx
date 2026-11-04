// pages/student/StudentComplaints.jsx — Student complaint list with filters
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, PlusCircle, Search, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import ComplaintCard from '../../components/ComplaintCard';
import { SkeletonCard } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import API from '../../api/axios';
import { CATEGORIES, STATUSES } from '../../utils/constants';

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', category: '' });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      const res = await API.get(`/complaints/my?${params.toString()}`);
      setComplaints(res.data.complaints);
      setTotal(res.data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, [filters]);

  const clearFilters = () => setFilters({ status: '', category: '' });
  const hasFilters = filters.status || filters.category;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Complaints</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} complaint{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/student/complaints/new" className="btn-primary shrink-0">
          <PlusCircle size={18} /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <Filter size={18} className="text-gray-500 shrink-0" />
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="input-field w-auto"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="input-field w-auto"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-600 hover:underline">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Complaint list */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={Search}
          title={hasFilters ? 'No complaints match filters' : 'No complaints yet'}
          description={hasFilters ? 'Try adjusting your filters.' : 'File your first complaint using the button above.'}
          action={
            hasFilters ? (
              <button onClick={clearFilters} className="btn-secondary mt-2">Clear Filters</button>
            ) : (
              <Link to="/student/complaints/new" className="btn-primary inline-flex items-center gap-2 mt-2">
                <PlusCircle size={18} /> File Complaint
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => <ComplaintCard key={c._id} complaint={c} />)}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentComplaints;
