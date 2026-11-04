// controllers/complaintController.js — CRUD for complaints
const Complaint = require('../models/Complaint');
const path = require('path');

/**
 * @desc    Create a new complaint (student)
 * @route   POST /api/complaints
 * @access  Private (student)
 */
const createComplaint = async (req, res) => {
  const { title, description, category, priority, hostel, block, room, preferredVisitingTime } =
    req.body;

  const complaintData = {
    title,
    description,
    category,
    priority: priority || 'Medium',
    location: { hostel, block, room },
    preferredVisitingTime,
    createdBy: req.user._id,
    statusHistory: [{ status: 'Pending', updatedBy: req.user._id }],
  };

  if (req.file) {
    complaintData.image = `/uploads/${req.file.filename}`;
  }

  const complaint = await Complaint.create(complaintData);
  await complaint.populate('createdBy', 'name email rollNumber hostel block roomNumber');

  res.status(201).json({ success: true, message: 'Complaint submitted successfully', complaint });
};

/**
 * @desc    Get complaints for the logged-in student
 * @route   GET /api/complaints/my
 * @access  Private (student)
 */
const getMyComplaints = async (req, res) => {
  const { status, category, page = 1, limit = 10 } = req.query;
  const filter = { createdBy: req.user._id };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const total = await Complaint.countDocuments(filter);
  const complaints = await Complaint.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('assignedTo', 'name role');

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    complaints,
  });
};

/**
 * @desc    Get all complaints (admin/staff)
 * @route   GET /api/complaints
 * @access  Private (admin/staff)
 */
const getAllComplaints = async (req, res) => {
  const { status, category, priority, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const total = await Complaint.countDocuments(filter);
  const complaints = await Complaint.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('createdBy', 'name email rollNumber hostel block roomNumber')
    .populate('assignedTo', 'name role');

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    complaints,
  });
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
const getComplaintById = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('createdBy', 'name email rollNumber hostel block roomNumber phone')
    .populate('assignedTo', 'name role email')
    .populate('remarks.by', 'name role')
    .populate('statusHistory.updatedBy', 'name role');

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  // Students can only view their own complaints
  if (req.user.role === 'student' && complaint.createdBy._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
  }

  res.json({ success: true, complaint });
};

/**
 * @desc    Update complaint (student, only Pending)
 * @route   PUT /api/complaints/:id
 * @access  Private (student)
 */
const updateComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }
  if (complaint.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  if (complaint.status !== 'Pending') {
    return res.status(400).json({ success: false, message: 'Only pending complaints can be edited' });
  }

  const { title, description, category, priority, hostel, block, room, preferredVisitingTime } = req.body;

  complaint.title = title || complaint.title;
  complaint.description = description || complaint.description;
  complaint.category = category || complaint.category;
  complaint.priority = priority || complaint.priority;
  if (hostel) complaint.location.hostel = hostel;
  if (block) complaint.location.block = block;
  if (room) complaint.location.room = room;
  if (preferredVisitingTime) complaint.preferredVisitingTime = preferredVisitingTime;
  if (req.file) complaint.image = `/uploads/${req.file.filename}`;

  await complaint.save();
  res.json({ success: true, message: 'Complaint updated', complaint });
};

/**
 * @desc    Delete complaint (student, only Pending)
 * @route   DELETE /api/complaints/:id
 * @access  Private (student)
 */
const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }
  if (complaint.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  if (complaint.status !== 'Pending') {
    return res.status(400).json({ success: false, message: 'Only pending complaints can be deleted' });
  }

  await complaint.deleteOne();
  res.json({ success: true, message: 'Complaint deleted successfully' });
};

/**
 * @desc    Update complaint status (admin/staff)
 * @route   PATCH /api/complaints/:id/status
 * @access  Private (admin/staff)
 */
const updateStatus = async (req, res) => {
  const { status, assignedTo, note } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  complaint.status = status;
  if (assignedTo !== undefined) complaint.assignedTo = assignedTo || null;
  complaint.statusHistory.push({ status, updatedBy: req.user._id, note: note || '' });

  await complaint.save();
  await complaint.populate('createdBy', 'name email');
  await complaint.populate('assignedTo', 'name role');

  res.json({ success: true, message: 'Status updated', complaint });
};

/**
 * @desc    Add remark to complaint (admin/staff)
 * @route   POST /api/complaints/:id/remarks
 * @access  Private (admin/staff)
 */
const addRemark = async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Remark message is required' });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  complaint.remarks.push({ message: message.trim(), by: req.user._id });
  await complaint.save();
  await complaint.populate('remarks.by', 'name role');

  res.json({ success: true, message: 'Remark added', remarks: complaint.remarks });
};

/**
 * @desc    Submit feedback for a resolved complaint (student)
 * @route   POST /api/complaints/:id/feedback
 * @access  Private (student)
 */
const submitFeedback = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }
  if (complaint.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  if (complaint.status !== 'Resolved') {
    return res.status(400).json({ success: false, message: 'Feedback only for resolved complaints' });
  }
  if (complaint.feedback && complaint.feedback.rating) {
    return res.status(400).json({ success: false, message: 'Feedback already submitted' });
  }

  complaint.feedback = { rating: Number(rating), comment, submittedAt: new Date() };
  await complaint.save();

  res.json({ success: true, message: 'Feedback submitted', feedback: complaint.feedback });
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateStatus,
  addRemark,
  submitFeedback,
};
