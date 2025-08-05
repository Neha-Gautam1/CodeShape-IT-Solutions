import Subject from "../models/subject.model.js";
import Class from "../models/class.model.js";

/**
 * @desc   Create a subject under a class and assign a teacher
 * @route  POST /api/subjects
 * @access Private (Admin)
 */
export const createSubject = async (req, res) => {
  const { name, classId, teacherId } = req.body;
  try {
    // Create new subject document
    const subject = new Subject({ name, classId, teacherId });
    await subject.save();

    // Add subject reference to the class
    await Class.findByIdAndUpdate(classId, {
      $addToSet: { subjects: subject._id }
    });

    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc   Get all subjects under a class with teacher info
 * @route  GET /api/subjects/class/:classId
 * @access Private (Admin/Teacher)
 */
export const getSubjectsByClass = async (req, res) => {
  const { classId } = req.params;
  try {
    // Find subjects for the given class and populate teacher details
    const subjects = await Subject.find({ classId })
      .populate("teacherId", "name email");

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc   Update a subject's name or assigned teacher
 * @route  PUT /api/subjects/:id
 * @access Private (Admin)
 */
export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, teacherId } = req.body;

  // Update subject document with new name and/or teacher
  const updated = await Subject.findByIdAndUpdate(
    id,
    { name, teacherId },
    { new: true }
  );

  res.json(updated);
};

/**
 * @desc   Delete a subject by ID
 * @route  DELETE /api/subjects/:id
 * @access Private (Admin)
 */
export const deleteSubject = async (req, res) => {
  const { id } = req.params;

  // Delete subject document
  await Subject.findByIdAndDelete(id);

  res.json({ message: "Subject deleted" });
};

/**
 * @desc   Get all subjects assigned to a specific teacher
 * @route  GET /api/subjects/teacher/:teacherId
 * @access Private (Teacher/Admin)
 */
export const getSubjectsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Find subjects by teacher and populate class name
    const subjects = await Subject.find({ teacherId })
      .populate('classId', 'name'); // also show class name

    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch teacher subjects', error: err.message });
  }
};

/**
 * @desc   Get all subjects (for admin dashboard or analytics)
 * @route  GET /api/subjects
 * @access Private (Admin)
 */
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subjects", error: err.message });
  }
};
