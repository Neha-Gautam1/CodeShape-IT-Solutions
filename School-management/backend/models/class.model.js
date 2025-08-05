import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
