// models/announcement.model.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);
