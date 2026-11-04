// models/Complaint.js — Complaint schema with status history, remarks, feedback
const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  message: { type: String, required: true },
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    required: true,
  },
  date: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String },
});

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Water',
        'Electricity',
        'Mess',
        'Cleaning',
        'Internet',
        'Furniture',
        'Security',
        'Plumbing',
        'AC/Heating',
        'Other',
      ],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    location: {
      hostel: { type: String, required: true },
      block: { type: String },
      room: { type: String },
    },
    image: {
      type: String, // URL/path to image
    },
    preferredVisitingTime: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    remarks: [remarkSchema],
    statusHistory: [statusHistorySchema],
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, maxlength: 500 },
      submittedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
complaintSchema.index({ createdBy: 1, status: 1 });
complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
