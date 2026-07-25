require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const LearningResource = require('../models/LearningResource');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aatmanirbhar_nari';

async function fixImagesLocal() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Update Handicrafts
    const handicraftsRes = await LearningResource.updateOne(
      { title: 'Selling Indian Handicrafts Online' },
      { $set: { image: '/images/indian_handicrafts.png' } }
    );
    console.log('Handicrafts update:', handicraftsRes.modifiedCount);

    // Update Online Coaching
    const coachingRes = await LearningResource.updateOne(
      { title: 'Starting a Profitable Online Coaching Business' },
      { $set: { image: '/images/online_coaching.png' } }
    );
    console.log('Coaching update:', coachingRes.modifiedCount);

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixImagesLocal();
