const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Business = require('../models/Business');
const Inquiry = require('../models/Inquiry');
const Notification = require('../models/Notification');
const Order = require('../models/Order');
const MentorApplication = require('../models/MentorApplication');

async function clearData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared all Users');

    await Business.deleteMany({});
    console.log('Cleared all Businesses');

    await Inquiry.deleteMany({});
    console.log('Cleared all Inquiries');

    await Notification.deleteMany({});
    console.log('Cleared all Notifications');

    await Order.deleteMany({});
    console.log('Cleared all Orders');

    await MentorApplication.deleteMany({});
    console.log('Cleared all Mentor Applications');

    console.log('All user data cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
}

clearData();
