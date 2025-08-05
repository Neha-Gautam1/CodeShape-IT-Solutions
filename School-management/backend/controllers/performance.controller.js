import Performance from '../models/performance.model.js';
import Subject from '../models/subject.model.js';

/**
 * @desc   Add or update performance record for a student
 * @route  POST /api/performance
 * @access Private (Teacher/Admin)
 */
export const addPerformance = async (req, res) => {
  let { studentId, classId, subjectId, marks, attendance, remarks } = req.body;

  try {
    // Validate required fields
    if (!studentId || !subjectId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Auto-fetch classId from subject if not provided
    if (!classId) {
      const subject = await Subject.findById(subjectId);
      if (!subject) return res.status(404).json({ message: 'Subject not found' });
      classId = subject.classId;
    }

    // Upsert performance record for the student and subject
    const updated = await Performance.findOneAndUpdate(
      { studentId, subjectId },
      { studentId, classId, subjectId, marks, attendance, remarks },
      { new: true, upsert: true }
    );

    // Respond with the updated/created performance record
    res.status(201).json(updated);
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ message: "Failed to add/update performance", error: err.message });
  }
};

/**
 * @desc   Get all performance records for a specific student
 * @route  GET /api/performance/student/:studentId
 * @access Private (Student/Teacher/Admin)
 */
export const getPerformanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch performance data and populate subject and class names
    const data = await Performance.find({ studentId })
      .populate('subjectId', 'name')
      .populate('classId', 'name');

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch performance", error: err.message });
  }
};

/**
 * @desc   Get all performance records for a specific class
 * @route  GET /api/performance/class/:classId
 * @access Private (Teacher/Admin)
 */
export const getPerformanceByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Fetch performance records for all students in the class
    const data = await Performance.find({ classId })
      .populate('studentId', 'name email')
      .populate('subjectId', 'name');

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch class performance", error: err.message });
  }
};
