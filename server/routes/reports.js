const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect, authorize } = require('../middleware/auth');

// @desc    Create a new report/complaint
// @route   POST /api/reports
// @access  Private
router.post('/', protect, async (req, res) => {
  const { targetBusiness, type, description } = req.body;

  if (!type || !description) {
    return res.status(400).json({ message: 'Type and description are required' });
  }

  try {
    const report = new Report({
      reporter: req.user._id,
      targetBusiness: targetBusiness || undefined,
      type,
      description,
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  try {
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('reporter', 'name email')
        .populate('targetBusiness', 'name category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Report.countDocuments(filter)
    ]);

    res.json({
      reports,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalReports: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update report status (Admin only)
// @route   PATCH /api/reports/:id
// @access  Private/Admin
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
  const { status } = req.body;

  if (!['Open', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
