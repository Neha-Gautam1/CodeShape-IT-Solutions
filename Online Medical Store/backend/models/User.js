const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["Admin", "User"], required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  mobile: { type: String, default: "" },
  address: { type: String, default: "" },
  photo: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
