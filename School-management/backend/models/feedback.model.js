// models/feedback.model.js
import mongoose from 'mongoose';
const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Feedback', feedbackSchema);
