const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    
    // Seed default categories if database is completely empty
    if (categories.length === 0) {
      const defaultCats = [
        { name: 'Tiffin Services', image: '/categories/tiffin_services.png' },
        { name: 'Tailoring & Fashion', image: '/categories/tailoring_fashion.png' },
        { name: 'Beauty & Wellness', image: '/categories/beauty_wellness.png' },
        { name: 'Handicrafts', image: '/categories/handicrafts.png' },
        { name: 'Tuition & Coaching', image: '/categories/tuition_coaching.png' },
      ];
      await Category.insertMany(defaultCats);
      categories = await Category.find().sort({ name: 1 });
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { name, image } = req.body;

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      image,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = req.body.name || category.name;
    category.image = req.body.image !== undefined ? req.body.image : category.image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
