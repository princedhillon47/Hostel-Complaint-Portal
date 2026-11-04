// pages/public/Landing.jsx — Hero, Features, How it works, CTA
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { 
  ClipboardList, Bell, BarChart3, Shield, Zap, Users,
  CheckCircle, ArrowRight, Star
} from 'lucide-react';

const features = [
  { icon: ClipboardList, title: 'Easy Complaint Filing', desc: 'Submit complaints with photos, priority levels, and category tags in minutes.' },
  { icon: Bell, title: 'Real-time Tracking', desc: 'Get instant updates as your complaint moves through resolution stages.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Wardens get powerful insights to identify trends and allocate resources.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected with JWT authentication and role-based access control.' },
  { icon: Zap, title: 'Fast Resolution', desc: 'Automated routing and staff assignment ensures faster issue resolution.' },
  { icon: Users, title: 'Multi-role Support', desc: 'Designed for students, wardens, and maintenance staff workflow.' },
];

const steps = [
  { step: '01', title: 'Register & Login', desc: 'Create your student account with your roll number and hostel details.' },
  { step: '02', title: 'File a Complaint', desc: 'Describe your issue, pick a category, set priority, and optionally add a photo.' },
  { step: '03', title: 'Track Progress', desc: 'Monitor status updates and admin remarks in real time from your dashboard.' },
  { step: '04', title: 'Give Feedback', desc: 'Once resolved, rate the response and help improve hostel services.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-blue-500 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center relative">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <Star size={14} className="fill-current" /> Trusted by hostel students
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Your Hostel, Your Voice.
            <br />
            <span className="text-blue-200">Every Complaint Counts.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            A smart complaint management portal connecting students with hostel management for faster, transparent issue resolution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/30 transition-all border border-white/30"
            >
              Admin Login
            </Link>
          </div>
          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[['500+', 'Students'], ['98%', 'Resolution Rate'], ['24h', 'Avg Response']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white">{val}</div>
                <div className="text-blue-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A comprehensive suite of tools for seamless hostel complaint management.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all group">
                <div className="w-11 h-11 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                  <Icon size={22} className="text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Four simple steps from complaint to resolution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-100 dark:from-primary-800 dark:to-gray-800" />
                )}
                <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-600 text-white font-black text-lg mb-4 shadow-lg">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-700 dark:bg-primary-900">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-200 mb-8">
            Join your hostel community. Register now and start managing complaints effortlessly.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg"
          >
            Register as Student <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 text-white font-bold mb-2">
          <span>🏢</span> Hostel Complaint Portal
        </div>
        <p>© {new Date().getFullYear()} All rights reserved. Built for better hostel living.</p>
      </footer>
    </div>
  );
};

export default Landing;
