// controllers/adminController.js — Admin stats, students, staff management
const User = require('../models/User');
const Complaint = require('../models/Complaint');

/**
 * @desc    Get dashboard analytics stats
 * @route   GET /api/admin/stats
 * @access  Private (admin)
 */
const getStats = async (req, res) => {
  // Overall complaint counts
  const totalComplaints = await Complaint.countDocuments();
  const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
  const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
  const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
  const rejectedComplaints = await Complaint.countDocuments({ status: 'Rejected' });
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalStaff = await User.countDocuments({ role: 'staff' });

  // Complaints by category
  const byCategory = await Complaint.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Complaints by priority
  const byPriority = await Complaint.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Complaint.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Recent complaints
  const recentComplaints = await Complaint.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('createdBy', 'name email');

  res.json({
    success: true,
    stats: {
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      totalStudents,
      totalStaff,
      byCategory: byCategory.map((c) => ({ name: c._id, value: c.count })),
      byPriority: byPriority.map((p) => ({ name: p._id, value: p.count })),
      monthlyTrend: monthlyTrend.map((m) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        total: m.count,
        resolved: m.resolved,
      })),
      recentComplaints,
    },
  });
};

/**
 * @desc    Get all students (admin)
 * @route   GET /api/admin/students
 * @access  Private (admin)
 */
const getStudents = async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = { role: 'student' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(filter);
  const students = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Get complaint count per student
  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const complaintCount = await Complaint.countDocuments({ createdBy: student._id });
      return { ...student.toJSON(), complaintCount };
    })
  );

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), students: studentsWithStats });
};

/**
 * @desc    Toggle student active status
 * @route   PATCH /api/admin/students/:id/toggle
 * @access  Private (admin)
 */
const toggleStudentStatus = async (req, res) => {
  const student = await User.findById(req.params.id);
  if (!student || student.role !== 'student') {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  student.isActive = !student.isActive;
  await student.save();
  res.json({ success: true, message: `Student ${student.isActive ? 'activated' : 'deactivated'}`, student });
};

/**
 * @desc    Get all staff members
 * @route   GET /api/admin/staff
 * @access  Private (admin)
 */
const getStaff = async (req, res) => {
  const staff = await User.find({ role: 'staff' }).sort({ createdAt: -1 });

  const staffWithStats = await Promise.all(
    staff.map(async (member) => {
      const assignedCount = await Complaint.countDocuments({ assignedTo: member._id });
      const resolvedCount = await Complaint.countDocuments({ assignedTo: member._id, status: 'Resolved' });
      return { ...member.toJSON(), assignedCount, resolvedCount };
    })
  );

  res.json({ success: true, staff: staffWithStats });
};

/**
 * @desc    Create a staff member (admin)
 * @route   POST /api/admin/staff
 * @access  Private (admin)
 */
const createStaff = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const staff = await User.create({ name, email, password, phone, role: 'staff' });
  res.status(201).json({ success: true, message: 'Staff member created', staff });
};

module.exports = { getStats, getStudents, toggleStudentStatus, getStaff, createStaff };
