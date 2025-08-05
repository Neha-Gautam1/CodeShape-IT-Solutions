import express from 'express';
import {
  addPerformance,
  getPerformanceByStudent,
  getPerformanceByClass
} from '../controllers/performance.controller.js';

const router = express.Router();

// Add or update a student's performance in a subject
router.post('/add', addPerformance);

// Get all performance records of a specific student
router.get('/student/:studentId', getPerformanceByStudent);

// Get performance records of all students in a class
router.get('/class/:classId', getPerformanceByClass);

export default router;
