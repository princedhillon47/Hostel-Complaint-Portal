// pages/admin/AdminStudents.jsx
import { useEffect, useState, useCallback } from 'react';
import { Search, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const res = await API.get(`/admin/students?${params.toString()}`);
      setStudents(res.data.students);
      setTotal(res.data.total);
    } catch {}
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleToggle = async (id) => {
    try {
      const res = await API.patch(`/admin/students/${id}/toggle`);
      setStudents((prev) => prev.map((s) => s._id === id ? { ...s, isActive: res.data.student.isActive } : s));
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to update student status');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} student{total !== 1 ? 's' : ''} registered</p>
      </div>

      <div className="relative mb-5">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, roll number..."
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <Loader />
      ) : students.length === 0 ? (
        <EmptyState icon={Users} title="No students found" description="No students match your search." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  {['Student', 'Roll No', 'Room', 'Phone', 'Complaints', 'Status', 'Joined', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(s.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{s.rollNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {s.hostel ? `${s.hostel}, ${s.block}-${s.roomNumber}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.phone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary-600">{s.complaintCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${s.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(s._id)}
                        className="text-gray-500 hover:text-primary-600 transition-colors"
                        title={s.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {s.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminStudents;
