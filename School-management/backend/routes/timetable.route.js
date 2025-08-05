import express from 'express';
import { timetableUpload } from '../utils/multerConfig.js';
import { uploadTimetable, getAllTimetables, getClassTimetable } from '../controllers/timetable.controller.js';
import secureRoute from '../middlewares/secureRoute.js';
import roleCheck from '../middlewares/roleCheck.js';

const router = express.Router();

// Upload a timetable PDF (only for admin and teachers)
router.post(
  '/upload',
  secureRoute,
  roleCheck(['admin', 'teacher']),
  timetableUpload.single('file'),
  uploadTimetable
);

// Get all uploaded timetables (secure route)
router.get('/all', secureRoute, getAllTimetables);

// Get timetable by classId (secure route)
router.get('/class/:classId', secureRoute, getClassTimetable);

export default router;
