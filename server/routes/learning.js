const express = require('express');
const router = express.Router();
const LearningResource = require('../models/LearningResource');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all learning resources
// @route   GET /api/learning
// @access  Public
router.get('/', async (req, res) => {
  try {
    const resources = await LearningResource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single learning resource
// @route   GET /api/learning/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new learning resource
// @route   POST /api/learning
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { title, category, description, image, videoUrl, actionText, icon, pills } = req.body;

  try {
    const resource = new LearningResource({
      title,
      category,
      description,
      image,
      videoUrl,
      actionText,
      icon,
      pills,
    });

    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a learning resource
// @route   PUT /api/learning/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    Object.assign(resource, req.body);
    const updatedResource = await resource.save();

    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a learning resource
// @route   DELETE /api/learning/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
