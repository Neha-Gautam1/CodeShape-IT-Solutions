// routes/auth.route.js
import express from 'express';
import { loginUser, logoutUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Login route for admin/teacher/student/parent
router.post('/login', loginUser);

// Logout route to clear JWT cookie
router.post('/logout', logoutUser);

export default router;
