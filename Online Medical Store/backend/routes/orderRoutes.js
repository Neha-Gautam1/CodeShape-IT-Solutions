// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders,
  updateOrderStatus} = require('../controllers/orderController');
const { protect,adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin routes
router.get('/all', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
module.exports = router;
