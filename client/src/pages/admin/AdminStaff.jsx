// pages/admin/AdminStaff.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { UserPlus, Briefcase, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import API from '../../api/axios';
import { formatDate, getInitials } from '../../utils/helpers';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6).required('Password required'),
  phone: yup.string().matches(/^\d{10}$/, 'Must be 10 digits').optional(),
});

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const fetchStaff = async () => {
    try {
      const res = await API.get('/admin/staff');
      setStaff(res.data.staff);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/admin/staff', data);
      setStaff((prev) => [res.data.staff, ...prev]);
      toast.success('Staff member created!');
      reset();
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create staff');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Members</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{staff.length} staff member{staff.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary">
          <UserPlus size={18} /> Add Staff
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : staff.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No staff members"
          description="Add staff members to assign complaints to them."
          action={<button onClick={() => setModal(true)} className="btn-primary inline-flex items-center gap-2 mt-2"><UserPlus size={18} /> Add Staff</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div key={s._id} className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(s.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-primary-600">{s.assignedCount}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Assigned</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-green-600">{s.resolvedCount}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Resolved</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <CheckCircle size={12} className="text-green-500" />
                <span>Active since {formatDate(s.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={modal} onClose={() => { setModal(false); reset(); }} title="Add New Staff Member">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input {...register('name')} className="input-field" placeholder="John Doe" />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email *</label>
            <input {...register('email')} type="email" className="input-field" placeholder="john@hostel.com" />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password *</label>
            <input {...register('password')} type="password" className="input-field" placeholder="Min 6 characters" />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input {...register('phone')} className="input-field" placeholder="10-digit number" />
            {errors.phone && <p className="error-text">{errors.phone.message}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setModal(false); reset(); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminStaff;
