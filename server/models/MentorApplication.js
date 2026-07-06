const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  linkedin: { type: String },
  expertise: { type: String, required: true },
  experience: { type: Number, required: true },
  whyJoin: { type: String, required: true },
  image: { type: String }, // Store image URL
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MentorApplication', mentorApplicationSchema);
