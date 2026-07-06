const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aatmanirbhar_nari';

console.log('Connecting to MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', UserSchema, 'users');
    
    // Update all users to be verified
    const result = await User.updateMany({}, { $set: { isVerified: true } });
    console.log(`Updated ${result.modifiedCount} users to isVerified: true.`);
    
    const users = await User.find({});
    console.log('Current users:');
    users.forEach(u => {
      console.log(`- Name: ${u.name}, Email: ${u.email}, isVerified: ${u.isVerified}`);
    });
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
