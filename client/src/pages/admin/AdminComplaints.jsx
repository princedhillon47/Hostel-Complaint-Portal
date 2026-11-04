// pages/admin/AdminComplaints.jsx — Table with search, filters, pagination
import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import ComplaintCard from '../../components/ComplaintCard';
import { SkeletonCard } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import API from '../../api/axios';
import { CATEGORIES, STATUSES, PRIORITIES } from '../../utils/constants';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const LIMIT = 10;

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.append('search', search);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);

      const res = await API.get(`/complaints?${params.toString()}`);
      setComplaints(res.data.complaints);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {}
    setLoading(false);
  }, [page, search, filters]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);
  useEffect(() => { setPage(1); }, [search, filters]);

  const clearFilters = () => {
    setFilters({ status: '', category: '', priority: '' });
    setSearch('');
  };
  const hasFilters = filters.status || filters.category || filters.priority || search;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Complaints</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} complaint{total !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 mb-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className="input-field pl-10"
          />
        </div>
        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-gray-400" />
          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="input-field w-auto text-sm">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} className="input-field w-auto text-sm">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} className="input-field w-auto text-sm">
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-600 hover:underline">
              <X size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}</div>
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description={hasFilters ? 'Try adjusting your filters.' : 'No complaints have been submitted yet.'}
          action={hasFilters ? <button onClick={clearFilters} className="btn-secondary mt-2">Clear Filters</button> : null}
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} basePath="/admin/complaints" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="btn-secondary p-2 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === pages}
            className="btn-secondary p-2 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminComplaints;
