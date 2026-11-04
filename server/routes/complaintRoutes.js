// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateStatus,
  addRemark,
  submitFeedback,
} = require('../controllers/complaintController');

// Student: get own complaints
router.get('/my', protect, authorize('student'), getMyComplaints);

// Admin/Staff: get all complaints
router.get('/', protect, authorize('admin', 'staff'), getAllComplaints);

// Create complaint (student only)
router.post('/', protect, authorize('student'), upload.single('image'), createComplaint);

// Single complaint CRUD
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, authorize('student'), upload.single('image'), updateComplaint);
router.delete('/:id', protect, authorize('student'), deleteComplaint);

// Admin/Staff actions
router.patch('/:id/status', protect, authorize('admin', 'staff'), updateStatus);
router.post('/:id/remarks', protect, authorize('admin', 'staff'), addRemark);

// Student feedback
router.post('/:id/feedback', protect, authorize('student'), submitFeedback);

module.exports = router;
