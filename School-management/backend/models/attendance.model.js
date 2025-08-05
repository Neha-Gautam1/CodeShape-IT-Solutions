// models/attendance.model.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  present: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
