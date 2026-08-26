// backend/src/seeds/helpers.js

import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Review from '../models/Review.js';
import Banner from '../models/Banner.js';
import BeforeAfter from '../models/BeforeAfter.js';
import Video from '../models/Video.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';

/**
 * Clear all data from the database
 */
export const clearDatabase = async () => {
  console.log('\n🗑️  Clearing database...');

  const models = [
    User,
    Product,
    Category,
    Order,
    Cart,
    Wishlist,
    Review,
    Banner,
    BeforeAfter,
    Video,
    Coupon,
    Settings,
  ];

  for (const model of models) {
    try {
      const result = await model.deleteMany({});
      console.log(`  - ${model.modelName}: ${result.deletedCount} documents deleted`);
    } catch (error) {
      console.error(`  - ${model.modelName}: Error clearing - ${error.message}`);
    }
  }

  console.log('✅ Database cleared\n');
};

/**
 * Check if database is empty
 */
export const isDatabaseEmpty = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  const modelNames = [
    'users',
    'products',
    'categories',
    'orders',
    'carts',
    'wishlists',
    'reviews',
    'banners',
    'beforeafters',
    'videos',
    'coupons',
    'settings',
    'pages',
    'paymentverifications',
  ];

  for (const collection of collections) {
    if (modelNames.includes(collection.name)) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      if (count > 0) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Get seed data count
 */
export const getSeedCounts = async () => {
  const counts = {
    users: await User.countDocuments(),
    products: await Product.countDocuments(),
    categories: await Category.countDocuments(),
    orders: await Order.countDocuments(),
    carts: await Cart.countDocuments(),
    wishlists: await Wishlist.countDocuments(),
    reviews: await Review.countDocuments(),
    banners: await Banner.countDocuments(),
    beforeAfter: await BeforeAfter.countDocuments(),
    videos: await Video.countDocuments(),
    coupons: await Coupon.countDocuments(),
    settings: await Settings.countDocuments(),
  };

  return counts;
};

/**
 * Print seed summary
 */
export const printSeedSummary = async () => {
  const counts = await getSeedCounts();
  console.log('\n📊 Database Summary:');
  console.log('=' .repeat(40));

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  for (const [key, count] of Object.entries(counts)) {
    const padding = ' '.repeat(30 - key.length);
    console.log(`  ${key}:${padding}${count}`);
  }

  console.log('=' .repeat(40));
  console.log(`  TOTAL:${' '.repeat(24)}${total}\n`);
};

export default {
  clearDatabase,
  isDatabaseEmpty,
  getSeedCounts,
  printSeedSummary,
};