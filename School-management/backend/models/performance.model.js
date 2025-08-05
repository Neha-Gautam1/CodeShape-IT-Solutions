import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  attendance: {
    type: Number,
    required: true
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("Performance", performanceSchema);
