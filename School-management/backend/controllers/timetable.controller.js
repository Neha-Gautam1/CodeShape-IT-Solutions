import { Timetable } from '../models/timetable.model.js';

/**
 * @desc   Upload a new timetable PDF for a class
 * @route  POST /api/timetables
 * @access Private (Admin)
 */
export const uploadTimetable = async (req, res) => {
  try {
    const { className } = req.body;
    const file = req.file;

    // Ensure a file was uploaded
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Create new timetable entry
    const timetable = new Timetable({
      className,
      filePath: file.path,           // Full path to the stored file
      originalName: file.originalname, // Original file name uploaded
    });

    // Save to the database
    await timetable.save();

    res.status(201).json({ message: "Timetable uploaded", timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/**
 * @desc   Get all timetables (sorted by latest first)
 * @route  GET /api/timetables
 * @access Private (Admin/Teacher)
 */
export const getAllTimetables = async (req, res) => {
  try {
    // Fetch all timetables and sort by upload date descending
    const timetables = await Timetable.find().sort({ uploadedAt: -1 });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch timetables" });
  }
};

/**
 * @desc   Get timetable for a specific class
 * @route  GET /api/timetables/:classId
 * @access Private (Student/Teacher)
 */
export const getClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;

    // Fetch timetable where className matches provided classId
    const data = await Timetable.findOne({ className: classId });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching timetable", error: err.message });
  }
};
