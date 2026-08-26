// backend/src/seeds/products.js

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { slugify } from '../utils/helpers.js';

/**
 * Seed products data
 */
const seedProducts = async () => {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('⚠️  Products already exist. Skipping...');
      return;
    }

    // Get categories for reference
    const categories = await Category.find();
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat.name;
      return acc;
    }, {});

    const products = [
      // Soap Products
      {
        name: 'Oat Milk & Honey Soap',
        description: 'Indulge in the soothing goodness of our Handmade Oat Milk Honey Soap—a gentle and natural skincare solution tailored to pamper sensitive skin with the utmost care.',
        price: 18.99,
        originalPrice: 24.99,
        category: 'Soap',
        stock: 100,
        isActive: true,
        isFeatured: true,
        tags: ['natural', 'soothing', 'sensitive skin', 'honey', 'oat milk'],
        images: [
          'https://images.unsplash.com/photo-1601612628463-20b8ae7e5d38?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1599051025939-3941b17f6c21?w=400&h=400&fit=crop',
        ],
      },
      {
        name: 'Charcoal Detox Soap',
        description: 'Deep cleansing soap with activated charcoal to draw out impurities and toxins. Perfect for oily and acne-prone skin.',
        price: 16.99,
        originalPrice: 21.99,
        category: 'Soap',
        stock: 80,
        isActive: true,
        isFeatured: false,
        tags: ['charcoal', 'detox', 'cleansing', 'acne'],
        images: [
          'https://images.unsplash.com/photo-1601612628463-20b8ae7e5d38?w=400&h=400&fit=crop',
        ],
      },
      // Serum Products
      {
        name: 'Dark Spot Serum',
        description: 'Targeted elixir designed for radiant skin. Our powerful extracts work together to brighten and even skin tone while providing soothing repair.',
        price: 29.99,
        originalPrice: 39.99,
        category: 'Serum',
        stock: 50,
        isActive: true,
        isFeatured: true,
        tags: ['dark spots', 'brightening', 'even tone', 'radiance'],
        images: [
          'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop',
        ],
      },
      {
        name: 'Vitamin C Brightening Serum',
        description: 'Powerful Vitamin C serum to brighten dull skin and reduce the appearance of dark spots. Packed with antioxidants for a youthful glow.',
        price: 34.99,
        originalPrice: 44.99,
        category: 'Serum',
        stock: 45,
        isActive: true,
        isFeatured: true,
        tags: ['vitamin c', 'brightening', 'antioxidant', 'glow'],
        images: [
          'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop',
        ],
      },
      // Cream Products
      {
        name: 'Skin Hydration Cream',
        description: 'Discover the hydrating power of Hyaluronic Acid with our Skin Hydration Cream. Designed to help your skin retain moisture for a smoother, softer appearance.',
        price: 29.99,
        originalPrice: 35.99,
        category: 'Cream',
        stock: 60,
        isActive: true,
        isFeatured: true,
        tags: ['hydration', 'hyaluronic acid', 'moisture', 'smooth'],
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        ],
      },
      {
        name: 'Skin Firming Cream',
        description: 'Specially formulated cream with DMAE, Hyaluronic Acid, and Coenzyme Q10 to support your skin\'s natural firmness and elasticity.',
        price: 29.99,
        originalPrice: 37.99,
        category: 'Cream',
        stock: 55,
        isActive: true,
        isFeatured: false,
        tags: ['firming', 'anti-aging', 'elasticity', 'lifting'],
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        ],
      },
      // Scrub Products
      {
        name: 'Coffee & Peppermint Scrub',
        description: 'Invigorating scrub with coffee grounds and peppermint oil. Exfoliates dead skin cells and stimulates circulation for a radiant glow.',
        price: 19.99,
        originalPrice: 24.99,
        category: 'Scrub',
        stock: 70,
        isActive: true,
        isFeatured: false,
        tags: ['exfoliating', 'coffee', 'peppermint', 'invigorating'],
        images: [
          'https://images.unsplash.com/photo-1570194065650-d99fb4b8a5b1?w=400&h=400&fit=crop',
        ],
      },
      {
        name: 'Sugar & Honey Scrub',
        description: 'Gentle exfoliating scrub with sugar crystals and raw honey. Naturally softens and moisturizes while removing dead skin cells.',
        price: 17.99,
        originalPrice: 22.99,
        category: 'Scrub',
        stock: 65,
        isActive: true,
        isFeatured: false,
        tags: ['gentle', 'sugar', 'honey', 'moisturizing'],
        images: [
          'https://images.unsplash.com/photo-1570194065650-d99fb4b8a5b1?w=400&h=400&fit=crop',
        ],
      },
      // Bundle Products
      {
        name: 'Youthful Glow Bundle',
        description: 'Complete skincare set for a youthful glow. Includes serum, cream, and toner for a full routine.',
        price: 59.99,
        originalPrice: 79.99,
        category: 'Bundle',
        stock: 30,
        isActive: true,
        isFeatured: true,
        tags: ['bundle', 'youthful', 'glow', 'complete routine'],
        images: [
          'https://images.unsplash.com/photo-1584522320722-4f39af5a46c0?w=400&h=400&fit=crop',
        ],
      },
      {
        name: 'Ultimate Glow Kit',
        description: 'The ultimate collection of our best-selling products. Everything you need for radiant, glowing skin.',
        price: 114.99,
        originalPrice: 159.99,
        category: 'Bundle',
        stock: 20,
        isActive: true,
        isFeatured: true,
        tags: ['ultimate', 'glow', 'best-sellers', 'complete'],
        images: [
          'https://images.unsplash.com/photo-1584522320722-4f39af5a46c0?w=400&h=400&fit=crop',
        ],
      },
      // Gummies Products
      {
        name: 'Beauty Gummies - Glow',
        description: 'Delicious gummies packed with biotin, vitamin C, and collagen. Support healthy skin, hair, and nails from within.',
        price: 24.99,
        originalPrice: 29.99,
        category: 'Gummies',
        stock: 40,
        isActive: true,
        isFeatured: false,
        tags: ['gummies', 'beauty', 'collagen', 'vitamins'],
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
        ],
      },
      {
        name: 'Beauty Gummies - Radiance',
        description: 'Radiant skin from within with these delicious gummies. Formulated with vitamins and antioxidants for a natural glow.',
        price: 24.99,
        originalPrice: 29.99,
        category: 'Gummies',
        stock: 35,
        isActive: true,
        isFeatured: false,
        tags: ['gummies', 'radiance', 'antioxidants', 'glow'],
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
        ],
      },
      // Mask Products
      {
        name: 'Sheet Mask Set - Hydration',
        description: 'Set of 5 hydrating sheet masks infused with hyaluronic acid and aloe vera. Instant moisture boost for dry skin.',
        price: 14.99,
        originalPrice: 19.99,
        category: 'Mask',
        stock: 50,
        isActive: true,
        isFeatured: false,
        tags: ['sheet mask', 'hydration', 'hyaluronic acid', 'aloe vera'],
        images: [
          'https://images.unsplash.com/photo-1596524430615-b46475ddb6e4?w=400&h=400&fit=crop',
        ],
      },
      // Toner Products
      {
        name: 'Rose Water Toner',
        description: 'Refreshing rose water toner to balance skin pH and tighten pores. Soothes and hydrates for a radiant complexion.',
        price: 15.99,
        originalPrice: 19.99,
        category: 'Toner',
        stock: 45,
        isActive: true,
        isFeatured: false,
        tags: ['rose water', 'toner', 'balancing', 'soothing'],
        images: [
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
        ],
      },
    ];

    // Generate slugs
    const productsWithSlug = products.map((product) => ({
      ...product,
      slug: slugify(product.name),
    }));

    const created = await Product.insertMany(productsWithSlug);
    console.log(`✅ Created ${created.length} products`);
    console.log(`  - Products: ${created.map(p => p.name).join(', ')}`);

    return created;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

export default seedProducts;