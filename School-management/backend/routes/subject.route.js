import express from 'express';
import {
  createSubject,
  getSubjectsByClass,
  getSubjectsByTeacher,
  updateSubject,
  deleteSubject,
  getAllSubjects // ✅ ADD THIS
} from '../controllers/subject.controller.js';

const router = express.Router();

// Create a new subject under a class and assign a teacher
router.post('/add', createSubject);

// Get all subjects assigned to a class
router.get('/class/:classId', getSubjectsByClass);

// Get all subjects taught by a specific teacher
router.get('/teacher/:teacherId', getSubjectsByTeacher);

// Get all subjects (useful for admin dashboard)
router.get('/all', getAllSubjects); // ✅ ADD THIS LINE

// Update a subject's name or teacher
router.put('/update/:id', updateSubject);

// Delete a subject by ID
router.delete('/delete/:id', deleteSubject);

export default router;
