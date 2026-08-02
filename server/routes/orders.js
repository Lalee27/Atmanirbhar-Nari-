const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Business = require('../models/Business');
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const { getIo } = require('../socket');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_key_secret',
});
// POST /api/orders
// Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { businessId, items, totalAmount, deliveryAddress, contactNumber, paymentMethod, paymentStatus } = req.body;

    const order = new Order({
      customer: req.user._id,
      business: businessId,
      items,
      totalAmount,
      deliveryAddress,
      contactNumber,
      status: 'pending',
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentStatus || 'pending'
    });

    await order.save();
    
    // Notify the business owner
    const business = await Business.findById(businessId);
    if (business && business.owner) {
      try {
        const notification = await Notification.create({
          recipient: business.owner,
          title: 'New Order Received',
          message: `A new order has been placed for ${business.name}.`,
          type: 'business',
          link: '/dashboard/orders'
        });
        const io = getIo();
        io.to(business.owner.toString()).emit('new_notification', notification);
      } catch (err) {
        console.error('Socket.io error emitting order notification:', err);
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/orders/razorpay/create
// Create a Razorpay order
router.post('/razorpay/create', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Some error occurred' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/orders/razorpay/verify
// Verify Razorpay payment signature
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    
    // Pass either key_secret or the environment variable
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_key_secret';

    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === signature;

    if (isAuthentic) {
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/orders/mine
// Get orders for logged in user (customer gets their orders, entrepreneur gets orders for their businesses)
router.get('/mine', protect, async (req, res) => {
  try {
    if (req.user.role === 'entrepreneur' || req.user.role === 'admin') {
      // Find all businesses owned by this user
      const businesses = await Business.find({ owner: req.user._id });
      if (businesses.length > 0) {
        const businessIds = businesses.map(b => b._id);
        const orders = await Order.find({ business: { $in: businessIds } })
          .populate('customer', 'name email profilePicture')
          .populate('business', 'name')
          .sort({ createdAt: -1 });
        return res.json(orders);
      }
    }
    
    // Customer or no business found
    const orders = await Order.find({ customer: req.user._id })
      .populate('business', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PATCH /api/orders/:id
// Update order status/tracking (only entrepreneur can do this)
router.patch('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, trackingLocation } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const business = await Business.findById(order.business);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    if (
      req.user.role !== 'admin' &&
      (!business.owner || business.owner.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (status) {
      order.status = status;
      if (status === 'delivered' && order.paymentMethod === 'cod') {
        order.paymentStatus = 'completed';
      }
    }
    if (trackingLocation) {
      order.trackingLocation = trackingLocation;
    }

    await order.save();

    // Notify the customer of status update
    if (status) {
      try {
        const notification = await Notification.create({
          recipient: order.customer,
          title: 'Order Status Updated',
          message: `Your order from ${business.name} is now ${status}.`,
          type: 'business',
          link: '/dashboard/orders' // Customer order page
        });
        const io = getIo();
        io.to(order.customer.toString()).emit('new_notification', notification);
      } catch (err) {
        console.error('Socket.io error emitting order status notification:', err);
      }
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message, stack: error.stack });
  }
});

module.exports = router;
