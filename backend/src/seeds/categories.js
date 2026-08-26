// backend/src/seeds/categories.js

import Category from '../models/Category.js';
import { slugify } from '../utils/helpers.js';

/**
 * Seed categories data
 */
const seedCategories = async () => {
  try {
    // Check if categories already exist
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log('⚠️  Categories already exist. Skipping...');
      return;
    }

    const categories = [
      {
        name: 'Soap',
        description: 'Natural and nourishing soaps for gentle cleansing. Made with organic ingredients to keep your skin soft and healthy.',
        image: '/images/categories/soap.jpg',
        isActive: true,
      },
      {
        name: 'Serum',
        description: 'Potent serums packed with active ingredients. Target specific skin concerns like aging, dark spots, and dullness.',
        image: '/images/categories/serum.jpg',
        isActive: true,
      },
      {
        name: 'Cream',
        description: 'Luxurious creams for deep hydration and nourishment. Formulated to restore and protect your skin barrier.',
        image: '/images/categories/cream.jpg',
        isActive: true,
      },
      {
        name: 'Scrub',
        description: 'Gentle exfoliating scrubs to reveal fresh, glowing skin. Removes dead skin cells and unclogs pores.',
        image: '/images/categories/scrub.jpg',
        isActive: true,
      },
      {
        name: 'Bundle',
        description: 'Curated skincare bundles for complete routines. Save money while getting everything you need.',
        image: '/images/categories/bundle.jpg',
        isActive: true,
      },
      {
        name: 'Gummies',
        description: 'Delicious and nutritious beauty gummies. Nourish your skin from within with essential vitamins and minerals.',
        image: '/images/categories/gummies.jpg',
        isActive: true,
      },
      {
        name: 'Mask',
        description: 'Revitalizing face masks for an instant glow. Target specific skin concerns with concentrated ingredients.',
        image: '/images/categories/mask.jpg',
        isActive: true,
      },
      {
        name: 'Toner',
        description: 'Refreshing toners to balance and prep your skin. Restore pH balance and tighten pores.',
        image: '/images/categories/toner.jpg',
        isActive: true,
      },
    ];

    // Generate slugs
    const categoriesWithSlug = categories.map((cat) => ({
      ...cat,
      slug: slugify(cat.name),
    }));

    const created = await Category.insertMany(categoriesWithSlug);
    console.log(`✅ Created ${created.length} categories`);
    console.log(`  - Categories: ${created.map(c => c.name).join(', ')}`);

    return created;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

export default seedCategories;