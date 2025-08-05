import express from 'express';
import {
  uploadMaterial,
  getMaterials,
  getMaterialsByClassAndSubject,
  updateMaterial,
} from '../controllers/material.contoller.js';

import { materialUpload } from '../middlewares/materialUpload.js';

const router = express.Router();

// Upload material with a PDF file
router.post('/upload', materialUpload.single('file'), uploadMaterial);

// Get materials for a specific class
router.get('/class/:classId', getMaterials);

// Get materials for a specific class and subject
router.get('/class/:classId/subject/:subjectId', getMaterialsByClassAndSubject);

// Update material (title or file) by ID
router.put('/update/:id', materialUpload.single('file'), updateMaterial);

export default router;
