const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Optional for Google Auth users
  },
  role: {
    type: String,
    enum: ['entrepreneur', 'customer', 'admin'],
    default: 'customer',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    type: Object,
    default: {
      emailNotifications: true,
      smsAlerts: false,
    },
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
}, { optimisticConcurrency: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
