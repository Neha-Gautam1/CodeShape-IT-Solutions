import express from "express";
import secureRoute from "../middlewares/secureRoute.js";
import roleCheck from "../middlewares/roleCheck.js";
import {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getStudentsByClass,
  getParentChildren,
  getStudentsBySubject,
  updateStudentRollNumber,
  assignParentToStudent
} from "../controllers/user.controller.js";

const router = express.Router();

// Admin creates teacher/student/parent
router.post("/add", secureRoute, roleCheck("admin"), addUser);

// Admin fetches all users
router.get("/all", secureRoute, roleCheck("admin"), getAllUsers);

// Admin updates a specific user
router.put("/update/:role/:id", secureRoute, roleCheck("admin"), updateUser);

// Admin deletes a specific user
router.delete("/delete/:role/:id", secureRoute, roleCheck("admin"), deleteUser);

// Get students by class (admin and teacher)
router.get("/students/class/:classId", secureRoute, roleCheck(["admin", "teacher"]), getStudentsByClass);

// Get a parent's children
router.get('/parent-children/:parentId', getParentChildren);

// Get all students linked to a specific subject
router.get('/students/by-subject/:subjectId', getStudentsBySubject); // 🔥 New

// Update a student's roll number
router.put(
  "/update-rollnumber/:studentId",
  secureRoute,
  roleCheck(["admin", "teacher"]),
  updateStudentRollNumber
);

// Assign a parent to a student
router.post("/assign-parent", secureRoute, roleCheck(["admin", "teacher"]), assignParentToStudent);

export default router;
