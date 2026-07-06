const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const MentorApplication = require('../models/MentorApplication');
const { protect, authorize } = require('../middleware/auth');

// @desc    Public platform stats (for Hero widget)
// @route   GET /api/admin/public-stats
router.get('/public-stats', async (req, res) => {
  try {
    const [entrepreneurs, active] = await Promise.all([
      User.countDocuments({ role: 'entrepreneur' }),
      Business.countDocuments({ verificationStatus: 'approved' }),
    ]);

    res.json({
      totalEntrepreneurs: entrepreneurs,
      activeListings: active,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.use(protect, authorize('admin'));

// @desc    Platform stats
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [entrepreneurs, pending, inquiries, active, pendingMentors] = await Promise.all([
      User.countDocuments({ role: 'entrepreneur' }),
      Business.countDocuments({ verificationStatus: 'pending' }),
      Inquiry.countDocuments(),
      Business.countDocuments({ verificationStatus: 'approved' }),
      MentorApplication.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      totalEntrepreneurs: entrepreneurs,
      pendingApprovals: pending,
      totalInquiries: inquiries,
      activeListings: active,
      pendingMentors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Pending business profiles
// @route   GET /api/admin/pending
router.get('/pending', async (req, res) => {
  try {
    const businesses = await Business.find({ verificationStatus: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve or reject business
// @route   PATCH /api/admin/businesses/:id
router.patch('/businesses/:id', async (req, res) => {
  const { action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Action must be approve or reject' });
  }

  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    if (action === 'approve') {
      business.verificationStatus = 'approved';
      business.isVerified = true;
    } else {
      business.verificationStatus = 'rejected';
      business.isVerified = false;
    }

    await business.save();
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Pending mentor applications
// @route   GET /api/admin/mentors/pending
router.get('/mentors/pending', async (req, res) => {
  try {
    const mentors = await MentorApplication.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve or reject mentor
// @route   PATCH /api/admin/mentors/:id
router.patch('/mentors/:id', async (req, res) => {
  const { action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Action must be approve or reject' });
  }

  try {
    const mentor = await MentorApplication.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor application not found' });
    }

    mentor.status = action === 'approve' ? 'approved' : 'rejected';

    await mentor.save();
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
