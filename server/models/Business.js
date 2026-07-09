const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Tiffin Services', 
      'Tailoring & Fashion', 
      'Beauty & Wellness', 
      'Handicrafts', 
      'Tuition & Coaching', 
      'Home Decors', 
      'Cooking Classes', 
      'Fitness & Yoga', 
      'Gardening & Plants', 
      'Event Management'
    ],
  },
  location: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    area: { type: String, default: '' },
  },
  phone: { type: String, default: '' },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  menuImages: [{
    type: String,
  }],
  services: [serviceSchema],
  availability: {
    monday: { type: String, default: '09:00 - 18:00' },
    tuesday: { type: String, default: '09:00 - 18:00' },
    wednesday: { type: String, default: '09:00 - 18:00' },
    thursday: { type: String, default: '09:00 - 18:00' },
    friday: { type: String, default: '09:00 - 18:00' },
    saturday: { type: String, default: '10:00 - 14:00' },
    sunday: { type: String, default: 'Closed' },
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { optimisticConcurrency: true });

// Indexes for fast querying
businessSchema.index({ category: 1 });
businessSchema.index({ 'location.city': 1 });
businessSchema.index({ verificationStatus: 1 });
businessSchema.index({ rating: -1 });
businessSchema.index({ createdAt: -1 });
businessSchema.index({ owner: 1 });

module.exports = mongoose.model('Business', businessSchema);
