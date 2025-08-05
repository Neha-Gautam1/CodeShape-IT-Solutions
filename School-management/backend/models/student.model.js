import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    default: null
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student']
  },
  rollNumber: { type: Number },
}, {
  timestamps: true
});

export default mongoose.model("Student", studentSchema);
