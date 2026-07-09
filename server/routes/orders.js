const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Business = require('../models/Business');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');

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
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/orders/mine
// Get orders for logged in user (customer gets their orders, entrepreneur gets orders for their business)
router.get('/mine', protect, async (req, res) => {
  try {
    if (req.user.role === 'entrepreneur' || req.user.role === 'admin') {
      // Find the business owned by this user
      const business = await Business.findOne({ owner: req.user._id });
      if (business) {
        const orders = await Order.find({ business: business._id })
          .populate('customer', 'name email profilePicture')
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

    // Ensure the entrepreneur owns the business of this order
    const business = await Business.findOne({ owner: req.user._id });
    if (!business || business._id.toString() !== order.business.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (status) {
      order.status = status;
    }
    if (trackingLocation) {
      order.trackingLocation = trackingLocation;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
