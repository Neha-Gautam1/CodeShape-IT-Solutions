import express from 'express';
import { submitFeedback, getStudentFeedback } from '../controllers/feedback.controller.js';

const router = express.Router();

// Submit feedback from a student
router.post('/', submitFeedback);

// Get all feedback submitted by a specific student
router.get('/:studentId', getStudentFeedback);

export default router;
