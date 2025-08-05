import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../jwt/generateToken.js";

/**
 * @desc   Handle admin signup
 * @route  POST /api/admin/signup
 * @access Public
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the email is already registered
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user with hashed password
    const newUser = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    if (newUser) {
      // Generate JWT token and set it as a cookie
      generateToken(newUser._id, "admin", res);

      // Respond with success and user data (excluding password)
      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      });
    }
  } catch (err) {
    // Handle unexpected errors
    console.error("Error during signup:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc   Handle admin logout
 * @route  POST /api/admin/logout
 * @access Private
 */
export const logout = (req, res) => {
  try {
    // Clear the token cookie from the client
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    // Handle unexpected errors
    console.error("Error during logout:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
