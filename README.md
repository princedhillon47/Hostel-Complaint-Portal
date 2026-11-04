# 🏢 Hostel Complaint Portal

A full-stack, production-quality web application for managing hostel complaints. Students can register, file complaints, and track their status. Admins can review, assign, and resolve complaints through a powerful dashboard.

---

## 🚀 Tech Stack

| Layer       | Technology                                |
| ----------- | ----------------------------------------- |
| Frontend    | React 18 + Vite                           |
| Routing     | React Router v6                           |
| Forms       | React Hook Form + Yup validation          |
| Styling     | Tailwind CSS v3 (dark mode, mobile-first) |
| HTTP        | Axios with interceptors                   |
| State       | React Context API                         |
| Icons       | lucide-react                              |
| Toasts      | react-hot-toast                           |
| Charts      | Recharts                                  |
| Backend     | Node.js + Express.js                      |
| Database    | MongoDB + Mongoose                        |
| Auth        | JWT (localStorage + Axios interceptor)    |
| Passwords   | bcryptjs                                  |
| File Upload | Multer (images up to 2MB)                 |

---

## 📁 Project Structure

```
hostel-complaint-portal/
├── client/                       # React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ComplaintCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useDarkMode.js
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Landing.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── NotFound.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── NewComplaint.jsx
│   │   │   │   ├── StudentComplaints.jsx
│   │   │   │   ├── ComplaintDetail.jsx
│   │   │   │   └── StudentProfile.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminComplaints.jsx
│   │   │       ├── AdminComplaintDetail.jsx
│   │   │       ├── AdminStudents.jsx
│   │   │       └── AdminStaff.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                       # Express backend API
    ├── config/
    │   └── db.js                 # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   └── adminController.js
    ├── middleware/
    │   ├── auth.js               # JWT middleware
    │   ├── errorHandler.js       # Centralized error handler
    │   └── upload.js             # Multer file upload
    ├── models/
    │   ├── User.js
    │   └── Complaint.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── complaintRoutes.js
    │   └── adminRoutes.js
    ├── utils/
    │   ├── generateToken.js
    │   └── seed.js               # Database seeder
    ├── uploads/                  # Uploaded images
    ├── .env
    └── server.js
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- npm or pnpm

### 1. Clone / Navigate to Project

```bash
cd "d:\Projects\Hostel Complaint Portal"
```

### 2. Configure Environment Variables

**Server** (`server/.env`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel_complaint_portal
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Seed the Database

```bash
cd server
npm run seed
```

This creates:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hostel.com | Admin@123 |
| Staff | raju@hostel.com | Staff@123 |
| Staff | priya@hostel.com | Staff@123 |
| Student | arjun@student.com | Student@123 |
| Student | priya.student@student.com | Student@123 |
| Student | rahul@student.com | Student@123 |
| Student | anjali@student.com | Student@123 |
| Student | vikram@student.com | Student@123 |

### 5. Start the Servers

**Terminal 1 — Backend:**

```bash
cd server
npm run dev    # Uses nodemon for auto-reload
# OR
npm start      # Production
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

App runs at: **https://hostel-complaint-portal-gamma.vercel.app/**  
API runs at: **https://hostel-complaint-portal-6unm.onrender.com**

---

## 🌐 Pages & Routes

### Public

| Route       | Description                                   |
| ----------- | --------------------------------------------- |
| `/`         | Landing page with features, how-it-works, CTA |
| `/login`    | Login for all roles                           |
| `/register` | Student registration                          |

### Student (Protected)

| Route                     | Description                         |
| ------------------------- | ----------------------------------- |
| `/student/dashboard`      | Stats + recent complaints           |
| `/student/complaints/new` | File a new complaint                |
| `/student/complaints`     | List with status/category filters   |
| `/student/complaints/:id` | Detail, timeline, remarks, feedback |
| `/student/profile`        | Edit profile, change password       |

### Admin (Protected)

| Route                   | Description                              |
| ----------------------- | ---------------------------------------- |
| `/admin/dashboard`      | Analytics charts                         |
| `/admin/complaints`     | Searchable, filterable table             |
| `/admin/complaints/:id` | Update status, assign staff, add remarks |
| `/admin/students`       | Student list with toggle active/inactive |
| `/admin/staff`          | Staff management + add staff modal       |

---

## 📡 API Documentation

### Auth

```
POST /api/auth/register   - Register new student
POST /api/auth/login      - Login (all roles)
GET  /api/auth/me         - Get current user
PUT  /api/auth/profile    - Update profile
PUT  /api/auth/change-password - Change password
```

### Complaints

```
GET  /api/complaints/my         - Student: get own complaints
GET  /api/complaints            - Admin/Staff: get all (search, filter, paginate)
POST /api/complaints            - Student: create complaint (multipart/form-data)
GET  /api/complaints/:id        - Get single complaint
PUT  /api/complaints/:id        - Student: update (Pending only)
DELETE /api/complaints/:id      - Student: delete (Pending only)
PATCH /api/complaints/:id/status  - Admin/Staff: update status + assign
POST /api/complaints/:id/remarks  - Admin/Staff: add remark
POST /api/complaints/:id/feedback - Student: submit feedback (Resolved only)
```

### Admin

```
GET  /api/admin/stats             - Dashboard analytics
GET  /api/admin/students          - List students (search + paginate)
PATCH /api/admin/students/:id/toggle - Toggle student active status
GET  /api/admin/staff             - List staff with stats
POST /api/admin/staff             - Create staff member
```

### Query Parameters (GET /api/complaints)

| Param       | Description                                              |
| ----------- | -------------------------------------------------------- |
| `status`    | Filter by status (Pending/In Progress/Resolved/Rejected) |
| `category`  | Filter by category                                       |
| `priority`  | Filter by priority                                       |
| `search`    | Full-text search in title + description                  |
| `page`      | Page number (default: 1)                                 |
| `limit`     | Items per page (default: 10)                             |
| `sortBy`    | Sort field (default: createdAt)                          |
| `sortOrder` | asc or desc (default: desc)                              |

---

## 🎨 UI Features

- ✅ **Responsive** — mobile, tablet, desktop
- ✅ **Dark Mode** — toggle in sidebar/navbar, persisted to localStorage
- ✅ **Status Badges** — Pending=yellow, In Progress=blue, Resolved=green, Rejected=red
- ✅ **Priority Badges** — Low/Medium/High/Urgent with colors
- ✅ **Status Timeline** — visual history on complaint detail
- ✅ **Loading States** — skeleton cards, spinners
- ✅ **Empty States** — meaningful illustrations + actions
- ✅ **Confirmation Modal** — before deleting complaints
- ✅ **Charts** — bar chart, pie chart, line chart on admin dashboard
- ✅ **Image Upload** — drag-to-upload, 2MB limit, preview + remove
- ✅ **Star Rating** — interactive 1–5 star feedback
- ✅ **Collapsible Sidebar** — save screen real estate
- ✅ **Toast Notifications** — success/error on every action

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens stored in **localStorage** with Axios interceptor
- **Role-based access control** via middleware (`student`, `admin`, `staff`)
- **Route guards** — ProtectedRoute component in React
- Global 401 handler — auto redirects to login on expired token
- Input validation on both client (Yup) and server side
- Image upload validated for type (jpg/png) and size (2MB)

---
