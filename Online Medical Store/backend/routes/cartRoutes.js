const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, moveToWishlist,
     updateQuantity, getCartCount } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:id', protect, removeFromCart);
router.patch('/:id', protect, moveToWishlist);
// ✅ New route for updating quantity
router.put('/:id', protect, updateQuantity);
router.get('/count', protect, getCartCount);


module.exports = router;
