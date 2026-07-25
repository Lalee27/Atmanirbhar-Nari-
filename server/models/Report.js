const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetBusiness: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    // Optional, as reports can be general
  },
  type: {
    type: String,
    required: true,
    enum: ['Spam', 'Fraud', 'Inappropriate Content', 'General Complaint', 'Other'],
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { optimisticConcurrency: true });

reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
