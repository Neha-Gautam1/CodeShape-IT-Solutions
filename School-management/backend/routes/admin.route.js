import express from "express";
import { signup, logout } from "../controllers/admin.controller.js";
import secureRoute from "../middlewares/secureRoute.js";

const router = express.Router();

// Route for admin signup
router.post("/signup", signup);

// Route for admin logout
router.post("/logout", logout);

// Export router for use in server.js
export default router;
