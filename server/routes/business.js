const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { protect, authorize } = require('../middleware/auth');

const mapCategoryFilter = (cat) => {
  const map = {
    Tailoring: 'Tailoring & Fashion',
    Tutoring: 'Tuition & Coaching',
    Beauty: 'Beauty & Wellness',
  };
  return map[cat] || cat;
};

// @desc    Get all verified businesses (marketplace)
// @route   GET /api/businesses
router.get('/', async (req, res) => {
  const { category, city, availableToday, search, minPrice, maxPrice, minRating, page = 1, limit = 10 } = req.query;

  try {
    const filter = { verificationStatus: 'approved' };

    if (category && category !== 'Nearby') {
      filter.category = mapCategoryFilter(category);
    }
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    if (minPrice || maxPrice) {
      filter['services.price'] = {};
      if (minPrice) filter['services.price'].$gte = Number(minPrice);
      if (maxPrice) filter['services.price'].$lte = Number(maxPrice);
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (availableToday === 'true') {
      const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        new Date().getDay()
      ];
      filter[`availability.${day}`] = { $ne: 'Closed', $exists: true };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [businesses, total] = await Promise.all([
      Business.find(filter)
        .populate('owner', 'name profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Business.countDocuments(filter)
    ]);

    res.json({
      businesses,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalBusinesses: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get entrepreneur's businesses
// @route   GET /api/businesses/mine
router.get('/mine', protect, authorize('entrepreneur', 'admin'), async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.user._id }).populate('owner', 'name profilePicture email');
    res.json(businesses); // Return an array, even if empty
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single business
// @route   GET /api/businesses/:id
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'name profilePicture email');
    if (business) {
      res.json(business);
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create/Update business profile
// @route   POST /api/businesses
router.post('/', protect, authorize('entrepreneur', 'admin'), async (req, res) => {
  const { _id, name, category, description, images, menuImages, services, availability, location, phone, demoVideoUrl, meetingLink, experienceLevel, startingPrice } = req.body;

  try {
    if (_id) {
      // Update existing business
      let business = await Business.findById(_id);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }

      if (business.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to update this business' });
      }

      business.name = name ?? business.name;
      business.category = category ?? business.category;
      business.description = description ?? business.description;
      business.experienceLevel = experienceLevel ?? business.experienceLevel;
      business.startingPrice = startingPrice ?? business.startingPrice;
      if (images) business.images = images;
      if (menuImages !== undefined) business.menuImages = menuImages;
      if (services) business.services = services;
      if (availability) business.availability = availability;
      if (location) {
        business.location = business.location || {};
        Object.assign(business.location, location);
      }
      if (phone !== undefined) business.phone = phone;
      if (demoVideoUrl !== undefined) business.demoVideoUrl = demoVideoUrl;
      if (meetingLink !== undefined) business.meetingLink = meetingLink;

      const updatedBusiness = await business.save();
      return res.json(updatedBusiness);
    } else {
      // Create new business
      const newBusiness = new Business({
        owner: req.user._id,
        name,
        category,
        description,
        experienceLevel: experienceLevel || '',
        startingPrice,
        images: images || [],
        menuImages: menuImages || [],
        services: services || [],
        availability,
        location,
        phone,
        demoVideoUrl: demoVideoUrl || '',
        meetingLink: meetingLink || '',
        verificationStatus: 'pending',
        isVerified: false,
      });

      const createdBusiness = await newBusiness.save();
      return res.status(201).json(createdBusiness);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
