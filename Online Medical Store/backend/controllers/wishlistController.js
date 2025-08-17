const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');

// Get Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate("items.medicine");
    res.status(200).json(wishlist || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { medicineId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }

    const exists = wishlist.items.find(item => item.medicine.toString() === medicineId);
    if (!exists) {
      wishlist.items.push({ medicine: medicineId });
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => item.medicine.toString() !== req.params.id);
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error });
  }
};

// Move from Wishlist to Cart
exports.moveToCart = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    const cart = await Cart.findOne({ user: req.user.id }) || new Cart({ user: req.user.id, items: [] });

    const itemIndex = wishlist.items.findIndex(item => item.medicine.toString() === req.params.id);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in wishlist' });

    const [item] = wishlist.items.splice(itemIndex, 1);
    cart.items.push({ medicine: item.medicine, quantity: 1 });

    await wishlist.save();
    await cart.save();

    res.status(200).json({ wishlist, cart });
  } catch (error) {
    res.status(500).json({ message: 'Error moving item', error });
  }
};
