import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Attendance", "Performance", "Event", "Activity"],
      required: true,
    },
    description: String,
    fileUrl: String, // optional file upload
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
