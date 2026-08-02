const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for backward compatibility with existing data or guest inquiries
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
  createdAt: { type: Date, default: Date.now },
}, { optimisticConcurrency: true });

// Indexes for fast querying
inquirySchema.index({ business: 1, createdAt: -1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ customer: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
