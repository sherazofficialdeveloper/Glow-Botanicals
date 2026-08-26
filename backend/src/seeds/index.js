// backend/src/seeds/index.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedUsers from './users.js';
import seedCategories from './categories.js';
import seedProducts from './products.js';
import seedSettings from './settings.js';
import { clearDatabase } from './helpers.js';
import connectDB from '../config/database.js';

dotenv.config();

const runSeeds = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('📦 Connected to MongoDB');

    // Ask for confirmation in production
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  WARNING: You are about to seed data in PRODUCTION!');
      console.warn('⚠️  This will delete all existing data.');
      console.warn('⚠️  Press Ctrl+C to cancel, or wait 10 seconds to continue...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // Clear existing data
    const clear = process.argv.includes('--clear') || process.argv.includes('-c');
    if (clear) {
      await clearDatabase();
    }

    console.log('\n🌱 Starting database seeding...\n');

    // Run seeds in order
    await seedSettings();
    await seedUsers();
    await seedCategories();
    await seedProducts();

    console.log('\n✅ All seeds completed successfully!');
    console.log('📋 Summary:');
    console.log('  - Settings seeded');
    console.log('  - Users seeded');
    console.log('  - Categories seeded');
    console.log('  - Products seeded');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

// Check if we should run seeds
if (process.argv.includes('--run') || process.argv.includes('-r')) {
  runSeeds();
}

export default runSeeds;