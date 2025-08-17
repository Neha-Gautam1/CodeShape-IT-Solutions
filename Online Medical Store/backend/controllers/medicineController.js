// controllers/medicineController.js
const Medicine = require("../models/Medicine");

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const { name, category } = req.query;
    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = category;

    const medicines = await Medicine.find(filter);
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate("reviews.user", "name");
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};;

// Create new medicine
// Create new medicine
exports.createMedicine = async (req, res) => {
  const { name, description, price, image, discount, category } = req.body;
  const medicine = new Medicine({ name, description, price, image, discount, category });

  try {
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update medicine by ID
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    const { name, description, price, image, discount, category } = req.body;
    if (name !== undefined) medicine.name = name;
    if (description !== undefined) medicine.description = description;
    if (price !== undefined) medicine.price = price;
    if (image !== undefined) medicine.image = image;
    if (discount !== undefined) medicine.discount = discount;
    if (category !== undefined) medicine.category = category;

    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete medicine by ID
// Delete medicine by ID
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    const newReview = {
      user: req.user.id,
      rating,
      comment
    };
    medicine.reviews.push(newReview);
    await medicine.save();

    res.status(201).json({ message: "Review added", reviews: medicine.reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    medicine.reviews = medicine.reviews.filter(
      (rev) => rev._id.toString() !== req.params.reviewId.toString()
    );
    await medicine.save();

    res.json({ message: "Review deleted", reviews: medicine.reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};