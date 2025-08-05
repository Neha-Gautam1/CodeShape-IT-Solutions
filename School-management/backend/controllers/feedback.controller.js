import Feedback from "../models/feedback.model.js";

// controllers/feedback.controller.js

/**
 * @desc   Submit feedback from a student
 * @route  POST /api/feedback
 * @access Private (Student)
 */
export const submitFeedback = async (req, res) => {
  const { studentId, content } = req.body;

  try {
    // Create a new feedback entry
    const entry = new Feedback({ studentId, content });

    // Save the feedback to the database
    await entry.save();

    // Respond with the saved feedback
    res.status(201).json(entry);
  } catch (err) {
    // Handle any server-side errors
    res.status(500).json({ message: "Failed to submit feedback", error: err.message });
  }
};

/**
 * @desc   Get all feedback submitted by a specific student
 * @route  GET /api/feedback/student/:studentId
 * @access Private (Student/Teacher/Admin)
 */
export const getStudentFeedback = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch all feedback entries for the given student
    const data = await Feedback.find({ studentId });

    // Return the feedback entries
    res.json(data);
  } catch (err) {
    // Handle any server-side errors
    res.status(500).json({ message: "Error fetching feedback", error: err.message });
  }
};
