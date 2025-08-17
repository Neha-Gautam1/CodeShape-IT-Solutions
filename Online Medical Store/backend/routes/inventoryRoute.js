const express = require("express");
const router = express.Router();
const { getInventory, updateStock } = require("../controllers/inventoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Only Admin can access these routes
router.get("/", protect, adminOnly, getInventory);
router.put("/:medicineId", protect, adminOnly, updateStock);

module.exports = router;
