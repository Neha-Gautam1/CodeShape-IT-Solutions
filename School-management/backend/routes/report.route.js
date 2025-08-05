import express from "express";
import multer from "multer";
import {
  getAllReports,
  createReport,
  deleteReport,
  updateReport,
} from "../controllers/report.controller.js";

const router = express.Router();

// Configure storage for uploaded report files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/reports/"); // Store in /uploads/reports
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop(); // Get file extension
    cb(null, Date.now() + "." + ext); // Unique file name with timestamp
  },
});

const upload = multer({ storage });

// Get all reports
router.get("/", getAllReports);

// Upload a new report with file
router.post("/add", upload.single("file"), createReport);

// Update existing report and optionally update file
router.put("/update/:id", upload.single("file"), updateReport);

// Delete report by ID
router.delete("/:id", deleteReport);

export default router;
