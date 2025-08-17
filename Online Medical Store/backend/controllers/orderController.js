const Order = require('../models/Order');
const User = require('../models/User');
const twilio = require('twilio');

// Twilio setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Create new order after payment success
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentId, razorpayOrderId, signature } = req.body;

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      paymentId,
      razorpayOrderId,
      signature,
      paymentStatus: "Paid"
    });

    await order.save();

    // Fetch user details
    const user = await User.findById(req.user.id);

    // Prepare medicine list (name × qty)
    const medicineList = items
      .map(item => `${item.quantity} × ${item.medicineName || 'Unknown'}`)
      .join(', ');

    // Send SMS confirmation to user
    await client.messages.create({
      body: `Hello ${user.name}, your order (${order._id}) has been placed successfully. 
Items: ${medicineList}
Total: ₹${totalAmount}.
Thank you for shopping with PharmaCare!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.mobile // must be in E.164 format (+91XXXXXXXXXX)
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', error });
  }
};


// Get all orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.medicine', 'name price') // get medicine details
      .sort({ date: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

//admin
// Get all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email mobile address') // user details
      .populate('items.medicine', 'name price image') // medicine details
      .sort({ date: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all orders', error });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status', error });
  }
};
