import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";

// Create a class
export const createClass = async (req, res) => {
  try {
    const { name } = req.body;
    const newClass = new Class({ name });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all classes with students and subjects populated
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("students", "name email")
      .populate({
        path: "subjects",
        populate: {
          path: "teacherId",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign student to a class
export const assignStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    // Update student
    const student = await Student.findByIdAndUpdate(
      studentId,
      { classId },
      { new: true }
    );

    // Add to class document
    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: studentId }
    });

    res.status(200).json({ message: "Student assigned to class", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update class name
export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updated = await Class.findByIdAndUpdate(id, { name }, { new: true });
  res.json(updated);
};

// Delete class
export const deleteClass = async (req, res) => {
  const { id } = req.params;
  await Class.findByIdAndDelete(id);
  res.json({ message: "Class deleted" });
};
