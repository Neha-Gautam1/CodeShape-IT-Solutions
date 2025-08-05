import Announcement from "../models/announcement.model.js";

/**
 * @desc   Create a new announcement
 * @route  POST /api/announcements
 * @access Private (Teacher/Admin)
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { content, classId, subjectId, teacherId } = req.body;

    // Create a new announcement document
    const ann = new Announcement({ content, classId, subjectId, teacherId });

    // Save the announcement to the database
    await ann.save();

    // Return the saved announcement
    res.status(201).json(ann);
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Error creating announcement", error: err.message });
  }
};

/**
 * @desc   Get all announcements for a specific class
 * @route  GET /api/announcements/class/:classId
 * @access Public or Private (Based on system roles)
 */
export const getAnnouncementsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Fetch announcements for the given classId and populate subject and teacher names
    const data = await Announcement.find({ classId }).populate("subjectId teacherId", "name");

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcements", error: err.message });
  }
};

/**
 * @desc   Get announcements filtered by class and subject
 * @route  GET /api/announcements/class/:classId/subject/:subjectId
 * @access Public or Private (Based on system roles)
 */
export const getAnnouncementsByClassAndSubject = async (req, res) => {
  try {
    const { classId, subjectId } = req.params;

    // Find announcements matching classId and subjectId, populate teacher and subject names
    const data = await Announcement.find({ classId, subjectId }).populate("subjectId teacherId", "name");

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching filtered announcements", error: err.message });
  }
};

/**
 * @desc   Update an announcement's content
 * @route  PUT /api/announcements/:id
 * @access Private (Teacher/Admin)
 */
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find announcement by ID and update its content
    const updated = await Announcement.findByIdAndUpdate(id, { content }, { new: true });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating announcement", error: err.message });
  }
};
