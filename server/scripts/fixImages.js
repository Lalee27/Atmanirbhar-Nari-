require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const LearningResource = require('../models/LearningResource');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aatmanirbhar_nari';

async function fixImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Update Handicrafts
    const handicraftsRes = await LearningResource.updateOne(
      { title: 'Selling Indian Handicrafts Online' },
      { $set: { image: 'https://images.unsplash.com/photo-1605810757912-f04bf49547cb?w=800' } }
    );
    console.log('Handicrafts update:', handicraftsRes.modifiedCount);

    // Update Online Coaching
    const coachingRes = await LearningResource.updateOne(
      { title: 'Starting a Profitable Online Coaching Business' },
      { $set: { image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800' } }
    );
    console.log('Coaching update:', coachingRes.modifiedCount);

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixImages();
