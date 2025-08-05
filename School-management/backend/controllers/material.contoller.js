// controllers/material.controller.js
import Material from "../models/material.model.js";

/**
 * @desc   Upload a new study material (PDF)
 * @route  POST /api/materials
 * @access Private (Teacher/Admin)
 */
export const uploadMaterial = async (req, res) => {
  try {
    const { title, classId, subjectId, teacherId } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    // Build file URL from uploaded file
    const fileUrl = `/uploads/materials/${req.file.filename}`;

    // Create new material document
    const material = new Material({
      title,
      fileUrl,
      classId,
      subjectId,
      teacherId,
    });

    // Save material to database
    await material.save();

    // Respond with saved material
    res.status(201).json(material);
  } catch (err) {
    // Handle server error
    res.status(500).json({
      message: "Failed to upload material",
      error: err.message,
    });
  }
};

/**
 * @desc   Get all materials for a specific class
 * @route  GET /api/materials/class/:classId
 * @access Private (Students/Teachers/Admin)
 */
export const getMaterials = async (req, res) => {
  try {
    const { classId } = req.params;

    // Fetch materials for the given classId and populate subject name
    const materials = await Material.find({ classId }).populate("subjectId", "name");

    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: "Error fetching materials", error: err.message });
  }
};

/**
 * @desc   Get materials filtered by classId and subjectId
 * @route  GET /api/materials/class/:classId/subject/:subjectId
 * @access Private (Students/Teachers/Admin)
 */
export const getMaterialsByClassAndSubject = async (req, res) => {
  try {
    const { classId, subjectId } = req.params;

    // Fetch materials matching both class and subject
    const materials = await Material.find({ classId, subjectId }).populate("subjectId", "name");

    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: "Error fetching filtered materials", error: err.message });
  }
};

/**
 * @desc   Update an existing material (title and/or file)
 * @route  PUT /api/materials/:id
 * @access Private (Teacher/Admin)
 */
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Prepare update data
    const updateData = { title };

    // If a new file is uploaded, update the file URL
    if (req.file) {
      updateData.fileUrl = `/uploads/materials/${req.file.filename}`;
    }

    // Find material by ID and update it
    const updated = await Material.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating material", error: err.message });
  }
};
