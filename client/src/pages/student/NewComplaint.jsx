// pages/student/NewComplaint.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, X } from 'lucide-react';
import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

const schema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').required('Title is required'),
  description: yup.string().min(20, 'Description must be at least 20 characters').required('Description is required'),
  category: yup.string().oneOf(CATEGORIES).required('Category is required'),
  priority: yup.string().oneOf(PRIORITIES).required('Priority is required'),
  hostel: yup.string().required('Hostel is required'),
  block: yup.string().optional(),
  room: yup.string().optional(),
  preferredVisitingTime: yup.string().optional(),
});

const visitingTimes = [
  'Morning (9AM–12PM)',
  'Afternoon (12PM–4PM)',
  'Evening (4PM–7PM)',
  'Any time',
];

const NewComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      hostel: user?.hostel || '',
      block: user?.block || '',
      room: user?.roomNumber || '',
      priority: 'Medium',
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Complaint submitted successfully!');
      navigate('/student/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">File New Complaint</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Describe your issue clearly. We'll ensure it gets resolved promptly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="label">Complaint Title *</label>
            <input {...register('title')} className="input-field" placeholder="Brief title (min 5 chars)" />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select {...register('category')} className="input-field">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="error-text">{errors.category.message}</p>}
            </div>
            <div>
              <label className="label">Priority *</label>
              <select {...register('priority')} className="input-field">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.priority && <p className="error-text">{errors.priority.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description *</label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field resize-none"
              placeholder="Describe the issue in detail (min 20 characters)..."
            />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="label">Location</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input {...register('hostel')} className="input-field" placeholder="Hostel" />
                {errors.hostel && <p className="error-text">{errors.hostel.message}</p>}
              </div>
              <input {...register('block')} className="input-field" placeholder="Block" />
              <input {...register('room')} className="input-field" placeholder="Room No." />
            </div>
          </div>

          {/* Preferred visiting time */}
          <div>
            <label className="label">Preferred Visiting Time (optional)</label>
            <select {...register('preferredVisitingTime')} className="input-field">
              <option value="">Select time slot</option>
              {visitingTimes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Image upload */}
          <div>
            <label className="label">Attach Image (optional, max 2MB)</label>
            {imagePreview ? (
              <div className="relative inline-block mt-2">
                <img src={imagePreview} alt="Preview" className="h-40 rounded-lg object-cover border border-gray-300" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="mt-2 flex items-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-5 cursor-pointer hover:border-primary-400 transition-colors">
                <Upload size={22} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload image</p>
                  <p className="text-xs text-gray-400">JPG or PNG, max 2MB</p>
                </div>
                <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={18} />}
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewComplaint;
