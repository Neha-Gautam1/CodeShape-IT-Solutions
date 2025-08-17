const express = require("express");
const router = express.Router();
const { signup, login, updateProfile, getProfile } = require("../controllers/authController");
const { protect,adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const  User = require("../models/User");

// Change profile update route to accept single file upload with field name "photo"
// Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("photo"), updateProfile);


router.post("/signup", signup);
router.post("/login", login);
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }).select("-password");// exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
