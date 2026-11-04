// pages/public/Register.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { UserPlus, Eye, EyeOff, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object({
  name: yup.string().required('Full name is required').min(2, 'Too short'),
  email: yup.string().email('Invalid email').required('Email is required'),
  rollNumber: yup.string().required('Roll number is required'),
  phone: yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
  hostel: yup.string().required('Hostel name is required'),
  block: yup.string().required('Block is required'),
  roomNumber: yup.string().required('Room number is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      await registerUser(payload);
      toast.success('Registration successful! Welcome!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, ...rest }) => (
    <div>
      <label className="label">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="input-field"
        {...rest}
      />
      {errors[name] && <p className="error-text">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-700 dark:text-primary-400 font-bold text-2xl">
            <Building2 size={32} />
            Hostel Portal
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Create your student account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field name="name" label="Full Name" placeholder="Arjun Kumar" />
              <Field name="email" label="Email Address" type="email" placeholder="arjun@student.com" />
              <Field name="rollNumber" label="Roll Number" placeholder="CS2021001" />
              <Field name="phone" label="Phone Number" placeholder="9876543210" />
              <Field name="hostel" label="Hostel Name" placeholder="Block A Hostel" />
              <Field name="block" label="Block" placeholder="A" />
              <Field name="roomNumber" label="Room Number" placeholder="101" />

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min 6 chars, 1 uppercase, 1 number"
                    className="input-field pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password.message}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="label">Confirm Password</label>
                <input
                  {...register('confirmPassword')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className="input-field"
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-3 mt-6"
            >
              {isSubmitting
                ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <UserPlus size={18} />}
              {isSubmitting ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
