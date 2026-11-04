// pages/student/StudentProfile.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { User, Lock, Save } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const profileSchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').optional().nullable(),
  hostel: yup.string().optional(),
  block: yup.string().optional(),
  roomNumber: yup.string().optional(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Min 6 characters').required('New password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords do not match').required(),
});

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: user?.name, phone: user?.phone, hostel: user?.hostel, block: user?.block, roomNumber: user?.roomNumber },
  });

  const passwordForm = useForm({ resolver: yupResolver(passwordSchema) });

  const handleProfileUpdate = async (data) => {
    try {
      const res = await API.put('/auth/profile', data);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await API.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Avatar + name */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-black">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role} · {user?.rollNumber}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {[{ key: 'profile', icon: User, label: 'Profile Info' }, { key: 'password', icon: Lock, label: 'Change Password' }].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Profile form */}
        {tab === 'profile' && (
          <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="card p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input {...profileForm.register('name')} className="input-field" />
                {profileForm.formState.errors.name && <p className="error-text">{profileForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Phone</label>
                <input {...profileForm.register('phone')} className="input-field" placeholder="10-digit number" />
                {profileForm.formState.errors.phone && <p className="error-text">{profileForm.formState.errors.phone.message}</p>}
              </div>
              <div>
                <label className="label">Hostel</label>
                <input {...profileForm.register('hostel')} className="input-field" />
              </div>
              <div>
                <label className="label">Block</label>
                <input {...profileForm.register('block')} className="input-field" />
              </div>
              <div>
                <label className="label">Room Number</label>
                <input {...profileForm.register('roomNumber')} className="input-field" />
              </div>
              <div>
                <label className="label">Email (read-only)</label>
                <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
              </div>
            </div>
            <button type="submit" disabled={profileForm.formState.isSubmitting} className="btn-primary">
              <Save size={16} /> {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Password form */}
        {tab === 'password' && (
          <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="card p-6 space-y-4">
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label className="label">
                  {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                </label>
                <input {...passwordForm.register(field)} type="password" className="input-field" />
                {passwordForm.formState.errors[field] && (
                  <p className="error-text">{passwordForm.formState.errors[field].message}</p>
                )}
              </div>
            ))}
            <button type="submit" disabled={passwordForm.formState.isSubmitting} className="btn-primary">
              <Lock size={16} /> {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
