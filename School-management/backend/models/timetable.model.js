import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  className: { type: String, required: true },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const Timetable = mongoose.model('Timetable', timetableSchema);
