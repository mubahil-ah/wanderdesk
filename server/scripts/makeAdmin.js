import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import User from '../models/User.js';

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`Error: No user found with email "${email}"`);
      console.log('Tip: The user must sign in via Google at least once before you can make them admin.');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Success: ${email} is now admin`);
    console.log(`   Name: ${user.name}`);
    console.log(`   ID: ${user._id}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
