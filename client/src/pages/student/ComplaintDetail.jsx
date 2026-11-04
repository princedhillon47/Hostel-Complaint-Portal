// pages/student/ComplaintDetail.jsx — Full complaint view with timeline, remarks, feedback
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Trash2, Edit2, MapPin, Clock, User,
  CheckCircle, MessageSquare, Star, AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime, timeAgo } from '../../utils/helpers';
import { CATEGORY_ICONS, STATUS_COLORS } from '../../utils/constants';

const TimelineStep = ({ entry, isLast }) => {
  const colors = STATUS_COLORS[entry.status] || STATUS_COLORS['Pending'];
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1 ${colors.dot}`} />
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
      </div>
      <div className="pb-5 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-semibold ${colors.text}`}>{entry.status}</span>
          {entry.updatedBy && (
            <span className="text-xs text-gray-500">by {entry.updatedBy.name}</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.date)}</p>
        {entry.note && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">"{entry.note}"</p>}
      </div>
    </div>
  );
};

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-2xl transition-transform hover:scale-110 ${star <= value ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      >
        ★
      </button>
    ))}
  </div>
);

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const isOwner = complaint?.createdBy?._id === user?._id || complaint?.createdBy === user?._id;
  const canEdit = isOwner && complaint?.status === 'Pending';

  useEffect(() => {
    API.get(`/complaints/${id}`)
      .then((res) => setComplaint(res.data.complaint))
      .catch(() => navigate('/student/complaints', { replace: true }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/complaints/${id}`);
      toast.success('Complaint deleted');
      navigate('/student/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating');
    setSubmittingFeedback(true);
    try {
      await API.post(`/complaints/${id}/feedback`, { rating, comment });
      toast.success('Feedback submitted!');
      setComplaint((prev) => ({ ...prev, feedback: { rating, comment, submittedAt: new Date() } }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;
  if (!complaint) return null;

  return (
    <DashboardLayout>
      {/* Back + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600">
          <ArrowLeft size={16} /> Back
        </button>
        {isOwner && (
          <div className="flex gap-2">
            {canEdit && (
              <Link to={`/student/complaints/${id}/edit`} className="btn-secondary text-sm flex items-center gap-1.5">
                <Edit2 size={15} /> Edit
              </Link>
            )}
            {canEdit && (
              <button onClick={() => setDeleteModal(true)} className="btn-danger text-sm flex items-center gap-1.5">
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="card p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">{CATEGORY_ICONS[complaint.category]}</span>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{complaint.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <StatusBadge status={complaint.status} size="lg" />
                  <PriorityBadge priority={complaint.priority} />
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    {complaint.category}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Image */}
          {complaint.image && (
            <div className="card overflow-hidden">
              <img
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${complaint.image}`}
                alt="Complaint"
                className="w-full max-h-80 object-cover"
              />
            </div>
          )}

          {/* Remarks */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <MessageSquare size={18} /> Admin Remarks
            </h3>
            {complaint.remarks?.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No remarks yet.</p>
            ) : (
              <div className="space-y-3">
                {complaint.remarks.map((r) => (
                  <div key={r._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{r.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {r.by?.name} · {formatDateTime(r.date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback */}
          {complaint.status === 'Resolved' && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Star size={18} /> Feedback
              </h3>
              {complaint.feedback?.rating ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`text-xl ${s <= complaint.feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{complaint.feedback.rating}/5</span>
                  </div>
                  {complaint.feedback.comment && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{complaint.feedback.comment}"</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleFeedback} className="space-y-3">
                  <div>
                    <label className="label">Rating *</label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label className="label">Comment (optional)</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      className="input-field resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button type="submit" disabled={submittingFeedback || !rating} className="btn-primary text-sm">
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-5">
          {/* Details */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Location</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {complaint.location?.hostel}
                    {complaint.location?.block && `, Block ${complaint.location.block}`}
                    {complaint.location?.room && `, Room ${complaint.location.room}`}
                  </p>
                </div>
              </div>
              {complaint.preferredVisitingTime && (
                <div className="flex items-start gap-2">
                  <Clock size={15} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Preferred Time</p>
                    <p className="text-gray-500 dark:text-gray-400">{complaint.preferredVisitingTime}</p>
                  </div>
                </div>
              )}
              {complaint.assignedTo && (
                <div className="flex items-start gap-2">
                  <User size={15} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Assigned To</p>
                    <p className="text-gray-500 dark:text-gray-400">{complaint.assignedTo.name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Filed On</p>
                  <p className="text-gray-500 dark:text-gray-400">{formatDateTime(complaint.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <CheckCircle size={18} /> Status Timeline
            </h3>
            <div>
              {complaint.statusHistory?.map((entry, i) => (
                <TimelineStep
                  key={i}
                  entry={entry}
                  isLast={i === complaint.statusHistory.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Complaint">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-5">
            Are you sure you want to delete this complaint? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ComplaintDetail;
