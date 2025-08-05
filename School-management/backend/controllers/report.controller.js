import Report from "../models/report.model.js";
import path from "path";
import fs from "fs";

// Define the directory where report files are stored
const uploadDir = path.join(process.cwd(), "uploads/reports");

/**
 * @desc   Get all reports
 * @route  GET /api/reports
 * @access Private (Admin/Teacher)
 */
export const getAllReports = async (req, res) => {
  try {
    // Fetch all reports sorted by newest first
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch {
    // Handle server-side error
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

/**
 * @desc   Create a new report with optional file upload
 * @route  POST /api/reports
 * @access Private (Admin/Teacher)
 */
export const createReport = async (req, res) => {
  try {
    const { title, type, description } = req.body;

    // Set file path if a file is uploaded
    const file = req.file ? `/uploads/reports/${req.file.filename}` : null;

    // Create a new report document
    const newReport = new Report({
      title,
      type,
      description,
      fileUrl: file,
    });

    // Save the report to the database
    await newReport.save();

    res.status(201).json({ message: "Report created", report: newReport });
  } catch (err) {
    // Handle validation or saving errors
    res.status(400).json({ message: "Failed to create report", error: err.message });
  }
};

/**
 * @desc   Update a report and replace file if a new one is uploaded
 * @route  PUT /api/reports/:id
 * @access Private (Admin/Teacher)
 */
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description } = req.body;

    // Set new file path if a new file is uploaded
    const file = req.file ? `/uploads/reports/${req.file.filename}` : null;

    // Find existing report
    const existing = await Report.findById(id);
    if (!existing) return res.status(404).json({ message: "Report not found" });

    // Delete the old file if a new one is uploaded
    if (file && existing.fileUrl) {
      const oldPath = path.join(process.cwd(), existing.fileUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Update report fields
    existing.title = title;
    existing.type = type;
    existing.description = description;
    if (file) existing.fileUrl = file;

    // Save the updated report
    await existing.save();

    res.json({ message: "Report updated", report: existing });
  } catch (err) {
    // Handle update error
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

/**
 * @desc   Delete a report and its file from the server
 * @route  DELETE /api/reports/:id
 * @access Private (Admin/Teacher)
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the report to delete
    const existing = await Report.findById(id);
    if (!existing) return res.status(404).json({ message: "Report not found" });

    // Delete the associated file if it exists
    if (existing.fileUrl) {
      const filePath = path.join(process.cwd(), existing.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Delete the report from the database
    await Report.findByIdAndDelete(id);

    res.json({ message: "Report deleted" });
  } catch {
    // Handle deletion error
    res.status(500).json({ message: "Delete failed" });
  }
};
