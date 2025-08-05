import Attendance from "../models/attendance.model.js";
import Subject from "../models/subject.model.js";

/**
 * @desc   Mark attendance for a list of students for a given subject and date
 * @route  POST /api/attendance/mark
 * @access Private (Teacher/Admin)
 */
export const markAttendance = async (req, res) => {
  try {
    const { date, subjectId, records } = req.body;

    // Validate required fields
    if (!date || !subjectId || !records?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const classId = subject.classId; // Get classId from the subject
    const saved = []; // To store successfully saved records

    // Iterate over each record in the attendance list
    for (const rec of records) {
      try {
        // Skip if studentId or present status is invalid
        if (!rec.studentId || typeof rec.present !== 'boolean') {
          console.warn("Skipping invalid record:", rec);
          continue;
        }

        // Upsert (insert or update) the attendance record
        const result = await Attendance.findOneAndUpdate(
          { date, subjectId, studentId: rec.studentId },
          { studentId: rec.studentId, date, subjectId, classId, present: rec.present },
          { upsert: true, new: true }
        );
        saved.push(result); // Add result to saved list
      } catch (innerErr) {
        console.error("Error saving attendance for record:", rec, innerErr);
      }
    }

    // Respond with success and list of saved records
    res.status(200).json({ message: "Attendance marked", saved });
  } catch (err) {
    console.error("Unexpected error in markAttendance:", err);
    res.status(500).json({ message: "Error marking attendance", error: err.message });
  }
};

/**
 * @desc   Get all attendance records for a specific subject
 * @route  GET /api/attendance/subject/:subjectId
 * @access Private (Teacher/Admin)
 */
export const getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Fetch all attendance records for the subject and populate student details
    const records = await Attendance.find({ subjectId })
      .populate('studentId', 'name email');

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance", error: err.message });
  }
};

/**
 * @desc   Get attendance records for a subject on a specific date
 * @route  GET /api/attendance/by-date?subjectId=...&date=...
 * @access Private (Teacher/Admin)
 */
export const getAttendanceByDate = async (req, res) => {
  try {
    const { subjectId, date } = req.query;

    // Fetch attendance records filtered by subjectId and date
    const records = await Attendance.find({ subjectId, date }).populate('studentId', 'name');
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance by date", error: err.message });
  }
};

/**
 * @desc   Get summary attendance report for a specific student
 * @route  GET /api/attendance/student/:studentId
 * @access Private (Student/Teacher/Admin)
 */
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch all attendance records of the student
    const records = await Attendance.find({ studentId });

    // Calculate total classes, present count, and attendance percentage
    const total = records.length;
    const present = records.filter(r => r.present).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.status(200).json({ total, present, percentage });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance', error: err.message });
  }
};
