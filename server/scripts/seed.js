/**
 * Seed sample data: node scripts/seed.js
 * Requires MongoDB running and .env with JWT_SECRET
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aatmanirbhar_nari';

async function seed() {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({ email: { $in: ['admin@nari.test', 'sunita@nari.test', 'lakshmi@nari.test'] } });
  await Business.deleteMany({});

  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@nari.test',
    password: 'admin123',
    role: 'admin',
  });

  const entrepreneur = await User.create({
    name: 'Sunita Devi',
    email: 'sunita@nari.test',
    password: 'demo123',
    role: 'entrepreneur',
  });

  await Business.create({
    owner: entrepreneur._id,
    name: "Sunita's Stitch Studio",
    category: 'Tailoring & Fashion',
    description: 'Custom blouse and saree tailoring with 15 years of experience in Banarasi styles.',
    location: { city: 'Varanasi', state: 'Uttar Pradesh', area: 'Assi Ghat' },
    phone: '9876543210',
    images: [
      'https://images.unsplash.com/photo-1520004434532-668416a08753?w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500',
    ],
    services: [
      { name: 'Blouse stitching', price: 450, description: 'Includes fitting' },
      { name: 'Saree fall & pico', price: 250, description: '2-day turnaround' },
    ],
    isVerified: true,
    verificationStatus: 'approved',
    rating: 4.9,
    reviewCount: 42,
  });

  const pendingOwner = await User.create({
    name: 'Lakshmi Rao',
    email: 'lakshmi@nari.test',
    password: 'demo123',
    role: 'entrepreneur',
  });

  await Business.create({
    owner: pendingOwner._id,
    name: "Lakshmi's Home Kitchen",
    category: 'Tiffin Services',
    description: 'Healthy vegetarian tiffins — awaiting moderator approval.',
    location: { city: 'Delhi', state: 'Delhi', area: 'Saket' },
    verificationStatus: 'pending',
    isVerified: false,
  });

  console.log('Seed complete.');
  console.log('Admin: admin@nari.test / admin123');
  console.log('Entrepreneur: sunita@nari.test / demo123');
  console.log('Pending review: lakshmi@nari.test / demo123');
  console.log('Admin user id:', admin._id);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
