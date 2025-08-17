// routes/paymentRoutes.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    const options = { amount, currency, receipt };

    const order = await razorpay.orders.create(options);

    if (!order) return res.status(500).send("Unable to create order");

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/order/validate", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = shasum.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ success: false, msg: "Invalid transaction" });
  }

  res.json({
    success: true,
    msg: "Transaction successful",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});


module.exports = router;
