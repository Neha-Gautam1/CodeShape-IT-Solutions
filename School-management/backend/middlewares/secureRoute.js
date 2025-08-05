// middlewares/secureRoute.js

import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Parent from "../models/parent.model.js";

// Map user roles to their corresponding Mongoose models
const modelMap = {
  admin: Admin,
  teacher: Teacher,
  student: Student,
  parent: Parent,
};

// Middleware to verify JWT token and authenticate user
const secureRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" }); // No token
    }

    // Verify token using secret key
    const verified = jwt.verify(token, process.env.JWT_TOKEN);

    // Validate token structure
    if (!verified || !verified.userId || !verified.role) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Determine user model based on role
    const Model = modelMap[verified.role];
    if (!Model) {
      return res.status(403).json({ message: "Invalid user role" });
    }

    // Fetch user from DB (excluding password)
    const user = await Model.findById(verified.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info and role to the request for next middleware/controllers
    req.user = user;
    req.user.role = verified.role;

    next(); // ✅ Proceed to next middleware
  } catch (error) {
    console.error("Secure route error:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
};

export default secureRoute;
