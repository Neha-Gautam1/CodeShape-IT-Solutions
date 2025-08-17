const Medicine = require("../models/Medicine");

// Get all medicines with stock info
exports.getInventory = async (req, res) => {
  try {
    const medicines = await Medicine.find({}, "name stock price category");
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update stock for a specific medicine
exports.updateStock = async (req, res) => {
  const { medicineId } = req.params;
  const { stock } = req.body;

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({ message: "Invalid stock value" });
  }

  try {
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicine.stock = stock;
    await medicine.save();

    res.json({ message: "Stock updated successfully", medicine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
