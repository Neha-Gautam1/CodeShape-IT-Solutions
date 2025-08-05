// server.js

// Import required dependencies
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import route handlers
import adminRoutes from './routes/admin.route.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import classRoutes from "./routes/class.route.js";
import subjectRoutes from "./routes/subject.route.js";
import timetableRoute from './routes/timetable.route.js';
import reportRoutes from "./routes/report.route.js";
import performanceRoutes from './routes/performance.route.js';
import attendanceRoutes from './routes/attendance.route.js';
import materialRoutes from './routes/material.route.js';
import announcementRoutes from './routes/announcement.route.js';
import feedbackRoutes from './routes/feedback.route.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Define the port to run the server on
const PORT = process.env.PORT || 4002;

// Connect to MongoDB
connectDB();

// Apply middlewares
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Replace with your frontend URL in production
  credentials: true                // Allows sending cookies with requests
}));
app.use(cookieParser());           // Parse cookies from incoming requests
app.use(express.json());           // Parse JSON bodies from requests
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

// Define API routes and mount them to corresponding paths
app.use('/admin', adminRoutes);                 // Admin registration & login/logout
app.use('/api/users', userRoutes);              // User management: create/update/delete users
app.use('/api/auth', authRoutes);               // Auth routes for teacher/student/parent login
app.use("/api/classes", classRoutes);           // CRUD operations on classes
app.use("/api/subjects", subjectRoutes);        // CRUD operations on subjects
app.use('/api/timetable', timetableRoute);      // Upload/view class timetables
app.use("/api/reports", reportRoutes);          // Upload/update/delete reports
app.use('/api/performance', performanceRoutes); // Performance records
app.use('/api/attendance', attendanceRoutes);   // Attendance marking and fetching
app.use('/api/materials', materialRoutes);      // Study material upload and retrieval
app.use('/api/announcements', announcementRoutes); // Teacher announcements
app.use('/api/feedback', feedbackRoutes);       // Feedback submission and retrieval

// Root test route to verify server is running
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Start the server and listen on specified port
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
