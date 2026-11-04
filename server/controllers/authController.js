// controllers/authController.js — Auth: register, login, getMe
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  const { name, email, password, rollNumber, phone, hostel, block, roomNumber } = req.body;

  // Check duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
    rollNumber,
    phone,
    hostel,
    block,
    roomNumber,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user,
  });
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: 'Account has been deactivated' });
  }

  const token = generateToken(user._id);
  const userWithoutPassword = await User.findById(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: userWithoutPassword,
  });
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  const { name, phone, hostel, block, roomNumber } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, hostel, block, roomNumber },
    { new: true, runValidators: true }
  );

  res.json({ success: true, message: 'Profile updated', user });
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
};

module.exports = { register, login, getMe, updateProfile, changePassword };
