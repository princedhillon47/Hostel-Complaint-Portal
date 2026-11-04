// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStats,
  getStudents,
  toggleStudentStatus,
  getStaff,
  createStaff,
} = require('../controllers/adminController');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/students', protect, authorize('admin'), getStudents);
router.patch('/students/:id/toggle', protect, authorize('admin'), toggleStudentStatus);
router.get('/staff', protect, authorize('admin'), getStaff);
router.post('/staff', protect, authorize('admin'), createStaff);

module.exports = router;
