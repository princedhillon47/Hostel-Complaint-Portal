// pages/admin/AdminComplaintDetail.jsx — Full admin view with status update, remarks, assignment
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, MessageSquare, UserCheck, Send, MapPin, Clock, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Loader from '../../components/Loader';
import API from '../../api/axios';
import { formatDateTime } from '../../utils/helpers';
import { CATEGORY_ICONS, STATUS_COLORS, STATUSES } from '../../utils/constants';

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
          {entry.updatedBy && <span className="text-xs text-gray-500">by {entry.updatedBy.name}</span>}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.date)}</p>
        {entry.note && <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">"{entry.note}"</p>}
      </div>
    </div>
  );
};

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  // Update form state
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Remark state
  const [remarkMsg, setRemarkMsg] = useState('');
  const [addingRemark, setAddingRemark] = useState(false);

  useEffect(() => {
    Promise.all([
      API.get(`/complaints/${id}`),
      API.get('/admin/staff'),
    ]).then(([cRes, sRes]) => {
      const c = cRes.data.complaint;
      setComplaint(c);
      setStatus(c.status);
      setAssignedTo(c.assignedTo?._id || '');
      setStaff(sRes.data.staff);
    }).catch(() => navigate('/admin/complaints', { replace: true }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await API.patch(`/complaints/${id}/status`, {
        status,
        assignedTo: assignedTo || null,
        note: statusNote,
      });
      setComplaint(res.data.complaint);
      setStatusNote('');
      toast.success('Status updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddRemark = async () => {
    if (!remarkMsg.trim()) return;
    setAddingRemark(true);
    try {
      const res = await API.post(`/complaints/${id}/remarks`, { message: remarkMsg });
      setComplaint((prev) => ({ ...prev, remarks: res.data.remarks }));
      setRemarkMsg('');
      toast.success('Remark added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add remark');
    } finally {
      setAddingRemark(false);
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;
  if (!complaint) return null;

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Complaint Detail</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="card p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">{CATEGORY_ICONS[complaint.category]}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{complaint.title}</h2>
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

          {/* Student info */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <User size={16} /> Filed By
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Name</p><p className="font-medium">{complaint.createdBy?.name}</p></div>
              <div><p className="text-gray-400 text-xs">Roll No</p><p className="font-medium">{complaint.createdBy?.rollNumber}</p></div>
              <div><p className="text-gray-400 text-xs">Email</p><p className="font-medium">{complaint.createdBy?.email}</p></div>
              <div><p className="text-gray-400 text-xs">Phone</p><p className="font-medium">{complaint.createdBy?.phone || 'N/A'}</p></div>
              <div><p className="text-gray-400 text-xs">Room</p><p className="font-medium">{complaint.location?.hostel}, Block {complaint.location?.block}, Room {complaint.location?.room}</p></div>
              <div><p className="text-gray-400 text-xs">Filed On</p><p className="font-medium">{formatDateTime(complaint.createdAt)}</p></div>
            </div>
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

          {/* Admin update panel */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <UserCheck size={18} /> Update Complaint
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Assign To Staff</label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="input-field">
                  <option value="">Unassigned</option>
                  {staff.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Note (optional)</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={2}
                className="input-field resize-none"
                placeholder="Add a note about this status change..."
              />
            </div>
            <button onClick={handleUpdate} disabled={updating} className="btn-primary text-sm">
              {updating ? 'Updating...' : 'Update Complaint'}
            </button>
          </div>

          {/* Remarks */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <MessageSquare size={18} /> Remarks
            </h3>
            <div className="space-y-3 mb-4">
              {complaint.remarks?.length === 0
                ? <p className="text-sm text-gray-400 italic">No remarks yet.</p>
                : complaint.remarks?.map((r) => (
                  <div key={r._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{r.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.by?.name} · {formatDateTime(r.date)}</p>
                  </div>
                ))}
            </div>
            <div className="flex gap-2">
              <input
                value={remarkMsg}
                onChange={(e) => setRemarkMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRemark()}
                placeholder="Add a remark..."
                className="input-field flex-1 text-sm"
              />
              <button onClick={handleAddRemark} disabled={addingRemark || !remarkMsg.trim()} className="btn-primary px-3">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Details */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Location</p>
                  <p className="text-gray-500">
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
                    <p className="text-gray-500">{complaint.preferredVisitingTime}</p>
                  </div>
                </div>
              )}
              {complaint.assignedTo && (
                <div className="flex items-start gap-2">
                  <User size={15} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Assigned To</p>
                    <p className="text-gray-500">{complaint.assignedTo.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          {complaint.feedback?.rating && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Student Feedback</h3>
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className={`text-xl ${s <= complaint.feedback.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
                <span className="text-sm font-bold ml-1">{complaint.feedback.rating}/5</span>
              </div>
              {complaint.feedback.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{complaint.feedback.comment}"</p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Status Timeline</h3>
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
    </DashboardLayout>
  );
};

export default AdminComplaintDetail;
