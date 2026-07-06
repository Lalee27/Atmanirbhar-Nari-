const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Business = require('../models/Business');
const { protect, authorize } = require('../middleware/auth');

// @desc    Submit inquiry (customer)
// @route   POST /api/inquiries
router.post('/', async (req, res) => {
  const { businessId, customerName, customerEmail, customerPhone, message } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const inquiry = await Inquiry.create({
      business: businessId,
      customerName,
      customerEmail,
      customerPhone,
      message,
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get inquiries for entrepreneur's business
// @route   GET /api/inquiries/mine
router.get('/mine', protect, authorize('entrepreneur', 'admin'), async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.json([]);
    }

    const inquiries = await Inquiry.find({ business: business._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id
router.patch('/:id', protect, authorize('entrepreneur', 'admin'), async (req, res) => {
  const { status } = req.body;

  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('business');
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const business = await Business.findOne({ owner: req.user._id });
    if (
      req.user.role !== 'admin' &&
      (!business || inquiry.business._id.toString() !== business._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
