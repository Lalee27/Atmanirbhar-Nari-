const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  actionText: {
    type: String,
    default: 'Watch Video',
  },
  icon: {
    type: String,
    default: 'play_circle',
  },
  pills: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { optimisticConcurrency: true });

learningResourceSchema.index({ category: 1 });
learningResourceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LearningResource', learningResourceSchema);
