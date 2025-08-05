import bcrypt from "bcryptjs";
import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Parent from "../models/parent.model.js";
import Class from "../models/class.model.js";
import Subject from "../models/subject.model.js"; // needed for getStudentsBySubject

/**
 * @desc   Add a new user (teacher, student, or parent)
 * @route  POST /api/users
 * @access Private (Admin)
 */
export const addUser = async (req, res) => {
  const { name, email, password, role, classId } = req.body;

  try {
    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the user model based on role
    let Model;
    if (role === "teacher") Model = Teacher;
    else if (role === "student") Model = Student;
    else if (role === "parent") Model = Parent;
    else return res.status(400).json({ message: "Invalid role" });

    // Prevent duplicate email
    const existing = await Model.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const userData = { name, email, password: hashedPassword };

    // Assign class to student if provided
    if (role === "student" && classId) {
      userData.classId = classId;
    }

    // Save user to DB
    const user = new Model(userData);
    await user.save();

    // Link student to class
    if (role === "student" && classId) {
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { students: user._id },
      });
    }

    return res.status(201).json({ message: `${role} added successfully`, user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc   Get all users (teachers, students, parents)
 * @route  GET /api/users
 * @access Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password");
    const students = await Student.find().select("-password").populate("classId", "name");
    const parents = await Parent.find().select("-password");

    return res.status(200).json({
      teachers,
      students,
      parents,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

/**
 * @desc   Update user data and optionally reassign student to class
 * @route  PUT /api/users/:id/:role
 * @access Private (Admin)
 */
export const updateUser = async (req, res) => {
  const { id, role } = req.params;
  const { name, email, password, classId } = req.body;

  let Model;
  if (role === "teacher") Model = Teacher;
  else if (role === "student") Model = Student;
  else if (role === "parent") Model = Parent;
  else return res.status(400).json({ message: "Invalid role" });

  try {
    const user = await Model.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic fields
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Handle class reassignment if user is student
    if (role === "student") {
      const prevClassId = user.classId?.toString();
      if (classId && classId !== prevClassId) {
        // Remove student from old class
        if (prevClassId) {
          await Class.findByIdAndUpdate(prevClassId, {
            $pull: { students: user._id },
          });
        }
        // Add student to new class
        user.classId = classId;
        await Class.findByIdAndUpdate(classId, {
          $addToSet: { students: user._id },
        });
      }
    }

    await user.save();
    return res.status(200).json({ message: `${role} updated successfully`, user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc   Delete a user and unlink from class if student
 * @route  DELETE /api/users/:id/:role
 * @access Private (Admin)
 */
export const deleteUser = async (req, res) => {
  const { id, role } = req.params;

  let Model;
  if (role === "teacher") Model = Teacher;
  else if (role === "student") Model = Student;
  else if (role === "parent") Model = Parent;
  else return res.status(400).json({ message: "Invalid role" });

  try {
    const user = await Model.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Unlink student from class
    if (role === "student" && user.classId) {
      await Class.findByIdAndUpdate(user.classId, {
        $pull: { students: user._id },
      });
    }

    return res.status(200).json({ message: `${role} deleted successfully` });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc   Get all students assigned to a class
 * @route  GET /api/users/class/:classId/students
 * @access Private (Teacher/Admin)
 */
export const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await Student.find({ classId }).select("-password");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
};

/**
 * @desc   Get all children linked to a parent
 * @route  GET /api/users/parent/:parentId/children
 * @access Private (Parent)
 */
export const getParentChildren = async (req, res) => {
  const { parentId } = req.params;
  try {
    const parent = await Parent.findById(parentId).populate('children', 'name email classId');
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    res.status(200).json({ children: parent.children });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc   Get students enrolled in a subject (based on classId)
 * @route  GET /api/users/subject/:subjectId/students
 * @access Private (Teacher/Admin)
 */
export const getStudentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId).populate('classId');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const students = await Student.find({ classId: subject.classId._id }).select('-password');
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students by subject', error: err.message });
  }
};

/**
 * @desc   Update roll number for a student
 * @route  PUT /api/users/student/:studentId/rollnumber
 * @access Private (Admin)
 */
export const updateStudentRollNumber = async (req, res) => {
  const { studentId } = req.params;
  const { rollNumber } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.rollNumber = rollNumber;
    await student.save();

    res.status(200).json({ message: "Roll number updated successfully", student });
  } catch (err) {
    res.status(500).json({ message: "Failed to update roll number", error: err.message });
  }
};

/**
 * @desc   Assign a parent to a student
 * @route  POST /api/users/assign-parent
 * @access Private (Admin)
 */
export const assignParentToStudent = async (req, res) => {
  const { parentId, studentId } = req.body;

  try {
    const parent = await Parent.findById(parentId);
    const student = await Student.findById(studentId);

    if (!parent || !student) return res.status(404).json({ message: 'Parent or student not found' });

    // Add student to parent's children list
    parent.children.addToSet(studentId);
    await parent.save();

    res.status(200).json({ message: 'Parent assigned to student successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning parent', error: err.message });
  }
};
