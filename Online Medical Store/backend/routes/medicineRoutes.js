// routes/medicineRoutes.js
const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const { protect } = require("../middleware/authMiddleware");


// List all medicines
router.get("/", medicineController.getAllMedicines);

// Get one medicine by id
router.get("/:id", medicineController.getMedicineById);

// Create medicine
router.post("/", medicineController.createMedicine);

// Update medicine
router.put("/:id", medicineController.updateMedicine);

// Delete medicine
router.delete("/:id", medicineController.deleteMedicine);

// Reviews
router.post("/:id/reviews", protect, medicineController.addReview);
router.delete("/:id/reviews/:reviewId", protect, medicineController.deleteReview);

module.exports = router;
