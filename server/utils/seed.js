// utils/seed.js — Seed script: 1 admin, 2 staff, 5 students, sample complaints
require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');

// Configure public DNS resolvers to handle SRV records on Windows if local DNS fails
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to set custom DNS servers
}

const User = require('../models/User');
const Complaint = require('../models/Complaint');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected for seeding');
};

const categories = ['Water', 'Electricity', 'Mess', 'Cleaning', 'Internet', 'Furniture', 'Security', 'Plumbing'];
const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];

const sampleComplaints = [
  {
    title: 'Water leakage in bathroom',
    description: 'There is a continuous water leakage from the bathroom tap. It has been going on for 3 days now and wasting a lot of water.',
    category: 'Water',
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Power outlet not working',
    description: 'The power outlet near my study table is not working. I am unable to charge my laptop and study at night.',
    category: 'Electricity',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    title: 'Mess food quality degraded',
    description: 'The quality of food served in the mess has significantly degraded over the past week. The food is often cold and tasteless.',
    category: 'Mess',
    priority: 'Medium',
    status: 'Resolved',
  },
  {
    title: 'Room not cleaned for 5 days',
    description: 'My room has not been cleaned for more than 5 days. The cleaning staff has not visited despite multiple verbal requests.',
    category: 'Cleaning',
    priority: 'Low',
    status: 'Pending',
  },
  {
    title: 'WiFi not working in Block B',
    description: 'The WiFi connection in Block B ground floor has been down for 2 days. All students are facing issues accessing internet for studies.',
    category: 'Internet',
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Chair broken in room 204',
    description: 'The study chair in my room (204) has a broken leg and is very unstable. It is a safety hazard.',
    category: 'Furniture',
    priority: 'Medium',
    status: 'Resolved',
  },
  {
    title: 'Unknown person seen in hostel premises',
    description: 'An unknown person was seen loitering in the hostel premises late at night. The security should be more vigilant.',
    category: 'Security',
    priority: 'Urgent',
    status: 'Pending',
  },
  {
    title: 'Drain blocked in common bathroom',
    description: 'The drain in the common bathroom on 2nd floor is completely blocked causing water stagnation and bad smell.',
    category: 'Plumbing',
    priority: 'High',
    status: 'Pending',
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin Warden',
      email: 'admin@hostel.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '9876543210',
      hostel: 'Main Hostel',
    });
    console.log('✅ Admin created: admin@hostel.com / Admin@123');

    // Create Staff
    const staff1 = await User.create({
      name: 'Raju Maintenance',
      email: 'raju@hostel.com',
      password: 'Staff@123',
      role: 'staff',
      phone: '9876543211',
    });
    const staff2 = await User.create({
      name: 'Priya Housekeeping',
      email: 'priya@hostel.com',
      password: 'Staff@123',
      role: 'staff',
      phone: '9876543212',
    });
    console.log('✅ Staff created: raju@hostel.com, priya@hostel.com / Staff@123');

    // Create Students — using create() so pre-save hook hashes passwords
    const studentData = [
      { name: 'Arjun Kumar', email: 'arjun@student.com', password: 'Student@123', role: 'student', rollNumber: 'CS2021001', phone: '9876543213', hostel: 'Block A Hostel', block: 'A', roomNumber: '101' },
      { name: 'Priya Sharma', email: 'priya.student@student.com', password: 'Student@123', role: 'student', rollNumber: 'EC2021002', phone: '9876543214', hostel: 'Block B Hostel', block: 'B', roomNumber: '204' },
      { name: 'Rahul Singh', email: 'rahul@student.com', password: 'Student@123', role: 'student', rollNumber: 'ME2021003', phone: '9876543215', hostel: 'Block A Hostel', block: 'A', roomNumber: '305' },
      { name: 'Anjali Patel', email: 'anjali@student.com', password: 'Student@123', role: 'student', rollNumber: 'CE2021004', phone: '9876543216', hostel: 'Block C Hostel', block: 'C', roomNumber: '112' },
      { name: 'Vikram Nair', email: 'vikram@student.com', password: 'Student@123', role: 'student', rollNumber: 'IT2021005', phone: '9876543217', hostel: 'Block B Hostel', block: 'B', roomNumber: '210' },
    ];
    const students = [];
    for (const d of studentData) {
      students.push(await User.create(d));
    }

    console.log('✅ 5 students created: arjun@student.com, priya.student@student.com, etc. / Student@123');

    // Create sample complaints
    const complaintDocs = [];
    for (let i = 0; i < sampleComplaints.length; i++) {
      const student = students[i % students.length];
      const c = sampleComplaints[i];
      const doc = {
        ...c,
        location: { hostel: student.hostel, block: student.block, room: student.roomNumber },
        createdBy: student._id,
        preferredVisitingTime: 'Morning (9AM-12PM)',
        statusHistory: [{ status: 'Pending', updatedBy: admin._id }],
      };

      if (c.status !== 'Pending') {
        doc.assignedTo = c.status === 'In Progress' ? staff1._id : staff2._id;
        doc.statusHistory.push({ status: c.status, updatedBy: admin._id });
        doc.remarks = [{ message: `Assigned and being worked on. ${c.category} team notified.`, by: admin._id }];
      }

      if (c.status === 'Resolved') {
        doc.feedback = { rating: 4, comment: 'Issue resolved promptly. Thank you!', submittedAt: new Date() };
      }

      complaintDocs.push(doc);
    }

    await Complaint.insertMany(complaintDocs);
    console.log(`✅ ${complaintDocs.length} sample complaints created`);

    console.log('\n🎉 Seeding complete!\n');
    console.log('Login credentials:');
    console.log('  Admin:   admin@hostel.com    / Admin@123');
    console.log('  Staff:   raju@hostel.com     / Staff@123');
    console.log('  Staff:   priya@hostel.com    / Staff@123');
    console.log('  Student: arjun@student.com   / Student@123');
    console.log('  Student: priya.student@student.com / Student@123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
