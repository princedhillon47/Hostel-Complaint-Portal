// server.js — Entry point for the Hostel Complaint Portal API

require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ─── CORS Configuration ─────────────────────────────────────────────

const allowedOrigins = [
  "https://hostel-complaint-portal-gamma.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── General Middleware ──────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API Routes ──────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// ─── Health Check ────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Hostel Complaint Portal API is running",
  });
});

// ─── Centralized Error Handler ───────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
