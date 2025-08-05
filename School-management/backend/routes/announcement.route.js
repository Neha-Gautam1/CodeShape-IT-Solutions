import express from 'express';
import {
  createAnnouncement,
  getAnnouncementsByClass,
  getAnnouncementsByClassAndSubject,
  updateAnnouncement,
} from '../controllers/announcement.controller.js';

const router = express.Router();

// Route to create a new announcement
router.post('/add', createAnnouncement);

// Get all announcements for a specific class
router.get('/class/:classId', getAnnouncementsByClass);

// Get announcements filtered by both class and subject
router.get('/class/:classId/subject/:subjectId', getAnnouncementsByClassAndSubject);

// Update an existing announcement by ID
router.put('/update/:id', updateAnnouncement);

export default router;
