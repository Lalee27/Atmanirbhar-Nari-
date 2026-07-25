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

    // Create a real-time notification for the business owner
    const Notification = require('../models/Notification');
    const { getIo } = require('../socket');
    
    if (business.owner) {
      const notification = await Notification.create({
        recipient: business.owner,
        title: 'New Inquiry Received',
        message: `${customerName} has sent an inquiry regarding your business.`,
        type: 'inquiry',
        link: '/dashboard/inquiries'
      });

      try {
        const io = getIo();
        io.to(business.owner.toString()).emit('new_notification', notification);
      } catch (err) {
        console.error('Socket.io error emitting notification:', err);
      }
    }

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get inquiries for entrepreneur's business
// @route   GET /api/inquiries/mine
router.get('/mine', protect, authorize('entrepreneur', 'admin'), async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const businesses = await Business.find({ owner: req.user._id });
    if (businesses.length === 0) {
      return res.json({ inquiries: [], totalPages: 0, currentPage: 1, totalInquiries: 0 });
    }

    const businessIds = businesses.map(b => b._id);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [inquiries, total] = await Promise.all([
      Inquiry.find({ business: { $in: businessIds } })
        .populate('business', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Inquiry.countDocuments({ business: { $in: businessIds } })
    ]);

    res.json({
      inquiries,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalInquiries: total
    });
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

    const business = await Business.findById(inquiry.business._id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    if (
      req.user.role !== 'admin' &&
      business.owner.toString() !== req.user._id.toString()
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
