import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected, deleting users...');
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });