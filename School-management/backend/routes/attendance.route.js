import express from 'express';
import {
  markAttendance,
  getAttendanceBySubject,
  getAttendanceByDate,
  getStudentAttendance,
} from '../controllers/attendance.controller.js';

const router = express.Router();

// Route to mark attendance
router.post('/mark', markAttendance);

// Get all attendance records for a subject
router.get('/subject/:subjectId', getAttendanceBySubject);

// Get attendance records for a subject on a specific date (via query)
router.get('/by-date', getAttendanceByDate);

// Get attendance summary for a specific student
router.get('/student/:studentId', getStudentAttendance);

export default router;
