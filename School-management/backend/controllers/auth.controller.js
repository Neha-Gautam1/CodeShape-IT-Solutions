// controllers/auth.controller.js

import Admin from '../models/admin.model.js';
import Teacher from '../models/teacher.model.js';
import Student from '../models/student.model.js';
import Parent from '../models/parent.model.js';
import { generateToken } from '../jwt/generateToken.js';
import bcrypt from 'bcryptjs';

/**
 * @desc   Log in user (Admin, Teacher, Student, Parent)
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate required fields
  if (!role || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let user;
  let Model;

  try {
    // Determine which model to use based on the role
    switch (role) {
      case 'admin':
        Model = Admin;
        break;
      case 'teacher':
        Model = Teacher;
        break;
      case 'student':
        Model = Student;
        break;
      case 'parent':
        Model = Parent;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Find user by email
    user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate and set JWT token in cookie
    generateToken(user._id, role, res);

    // Build safe user payload to send in response
    let userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role,
    };

    // If student, also populate class details and roll number
    if (role === 'student') {
      const fullStudent = await Student.findById(user._id).populate('classId', 'name');
      userPayload.classId = fullStudent.classId?._id;
      userPayload.class = fullStudent.classId || null;
      userPayload.rollNumber = fullStudent.rollNumber || null;
    }

    // Respond with authenticated user info
    res.status(200).json(userPayload);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

/**
 * @desc   Log out user by clearing JWT cookie
 * @route  POST /api/auth/logout
 * @access Private
 */
export const logoutUser = (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0), // Expire the cookie immediately
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: 'Logout error', error: err.message });
  }
};
