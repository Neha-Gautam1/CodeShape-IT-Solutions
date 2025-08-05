// middlewares/materialUpload.js

import multer from "multer";
import path from "path";
import fs from "fs";

// Define upload directory path for study materials
const uploadDir = "uploads/materials";

// Ensure the directory exists; create if not
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure storage for multer: where and how files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in "uploads/materials"
  },
  filename: (req, file, cb) => {
    // Create a unique filename using timestamp + original name
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Filter to only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept PDF
  } else {
    cb(new Error("Only PDF files are allowed"), false); // Reject others
  }
};

// Export configured multer instance
export const materialUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
});
