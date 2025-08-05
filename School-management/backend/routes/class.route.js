import express from "express";
import {
  createClass,
  getAllClasses,
  updateClass,
  deleteClass,
  assignStudentToClass
} from "../controllers/class.controller.js";

const router = express.Router();

// Create a new class
router.post("/add", createClass);

// Get all available classes
router.get("/all", getAllClasses);

// Update class details by ID
router.put("/update/:id", updateClass);

// Delete a class by ID
router.delete("/delete/:id", deleteClass);

// Assign a student to a class
router.post("/assign-student", assignStudentToClass); // ✅ New route

export default router;
