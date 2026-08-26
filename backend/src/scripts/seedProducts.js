import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
import { slugify } from '../utils/helpers.js';

const PRODUCTS = [
  {
    name: 'Oat Milk Honey Soap',
    slug: 'oat-milk-honey-soap',
    price: 18.99,
    originalPrice: null,
    category: 'Soap',
    description:
      'Handmade soap with soothing oats, goat milk, and honey. Gentle exfoliation for sensitive skin.',
    images: [
      'https://cutiesglow.com/cdn/shop/files/1784305649037-generated-label-image-0.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784305649021-generated-label-image-1.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784305649031-generated-label-image-2.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784305649031-generated-label-image-3.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784305649035-generated-label-image-4.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784305649022-generated-label-image-5.jpg?v=1784342552',
    ],
    rating: 4.5,
    reviewCount: 895,
    stock: 100,
    sku: 'TRO0OATM',
    features: [
      'Nourishing Formula',
      'Gentle Exfoliation',
      'Sensitive Skin Solution',
      'Summery Fragrance',
    ],
    tags: [
      'gluten-free',
      'natural',
      'cruelty-free',
      'paraben-free',
      'sulfate-free',
    ],
    isFeatured: true,
  },

  {
    name: 'Dark Spot Serum for Normal Skin',
    slug: 'dark-spot-serum-for-normal-skin',
    price: 29.99,
    originalPrice: null,
    category: 'Serum',
    description:
      'Targeted elixir for radiant skin. Hydration sets the stage for targeted dark spot reduction with powerful extracts to brighten and even skin tone.',
    images: [
      'https://cutiesglow.com/cdn/shop/files/1784307057183-generated-label-image-0.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784307057197-generated-label-image-1.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784307057187-generated-label-image-2.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784307057190-generated-label-image-3.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784307057177-generated-label-image-4.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784307057176-generated-label-image-5.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784307057194-generated-label-image-6.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784307057187-generated-label-image-7.jpg?v=1784342552',
    ],
    rating: 4.2,
    reviewCount: 120,
    stock: 100,
    sku: 'FMN0SPOT',
    features: [
      'Brightens Dark Spots',
      'Even Skin Tone',
      'Soothes Repair',
      'Antioxidant Rich',
    ],
    tags: ['lactose-free', 'hormone-free'],
    isFeatured: true,
  },

  {
    name: 'Skin Hydration Cream',
    slug: 'skin-hydration-cream',
    price: 29.99,
    originalPrice: null,
    category: 'Cream',
    description:
      'Hydrating cream with Hyaluronic Acid to help skin retain moisture for a smoother, softer appearance.',
    images: [
      'https://cutiesglow.com/cdn/shop/files/1785169876207-generated-label-image-0.jpg?v=1785170263',
      'https://cutiesglow.com/cdn/shop/files/1785169876210-generated-label-image-1.jpg?v=1785170262',
      'https://cutiesglow.com/cdn/shop/files/1785169876202-generated-label-image-2.jpg?v=1785170262',
      'https://cutiesglow.com/cdn/shop/files/1785169876214-generated-label-image-3.jpg?v=1785170263',
      'https://cutiesglow.com/cdn/shop/files/1785169876207-generated-label-image-4.jpg?v=1785170262',
    ],
    rating: 4.3,
    reviewCount: 85,
    stock: 100,
    sku: 'OSM0HYDR',
    features: [
      'Hydrates Skin',
      'Smooths Appearance',
      'Enhances Texture',
      'Supports Elasticity',
    ],
    tags: [
      'gluten-free',
      'vegan',
      'cruelty-free',
      'fragrance-free',
    ],
    isFeatured: true,
  },

  {
    name: 'Skin Firming Cream',
    slug: 'skin-firming-cream',
    price: 29.99,
    originalPrice: null,
    category: 'Cream',
    description:
      "Firming cream with DMAE, Hyaluronic Acid, and Coenzyme Q10 to support skin's natural firmness and tone.",
    images: [
      'https://cutiesglow.com/cdn/shop/files/1784306841910-generated-label-image-0.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784306841914-generated-label-image-1.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784306841912-generated-label-image-2.jpg?v=1784342552',
      'https://cutiesglow.com/cdn/shop/files/1784306841906-generated-label-image-3.jpg?v=1784342552',
    ],
    rating: 4.6,
    reviewCount: 210,
    stock: 100,
    sku: 'OSM0FIRM',
    features: [
      'Firms & Tones',
      'Hydrates',
      'Supports Regeneration',
      'Antioxidant Rich',
    ],
    tags: [
      'gluten-free',
      'vegan',
      'cruelty-free',
      'paraben-free',
    ],
    isFeatured: true,
  },

  {
    name: 'The Youthful Glow Bundle',
    slug: 'the-youthful-glow-bundle',
    price: 59.99,
    originalPrice: null,
    category: 'Bundle',
    description:
      'A curated bundle to give you a youthful glow with our best-selling products.',
    images: [
      'https://cutiesglow.com/cdn/shop/files/212_97d7dba8-7258-4a3a-8bee-58dae610e2d9.png?v=1756162629',
    ],
    rating: 4.4,
    reviewCount: 45,
    stock: 100,
    sku: null,
    features: [
      'Complete Routine',
      'Hydrates & Firms',
      'Brightens Skin',
    ],
    tags: ['bundle', 'value'],
    isFeatured: true,
  },

  {
    name: 'The Ultimate Glow Kit',
    slug: 'the-ultimate-glow-kit',
    price: 114.99,
    originalPrice: 159.99,
    category: 'Bundle',
    description:
      'The ultimate kit for a complete glow-up. Save 28% on this bundle!',
    images: [
      'https://cutiesglow.com/cdn/shop/files/210.png?v=1756162629',
    ],
    rating: 4.8,
    reviewCount: 78,
    stock: 100,
    sku: null,
    features: [
      'Full Glow Routine',
      'All-in-One Kit',
      'Premium Ingredients',
    ],
    tags: ['bundle', 'best-seller'],
    isFeatured: true,
  },

  {
    name: 'The Radiance Bundle',
    slug: 'the-radiance-bundle',
    price: 49.99,
    originalPrice: 54.99,
    category: 'Bundle',
    description:
      'Get radiant skin with this bundle. Save 9% on your purchase.',
    images: [
      'https://cutiesglow.com/cdn/shop/files/213_2f71ca99-bdfe-416c-934f-4231f77732f9.png?v=1756162627',
    ],
    rating: 4.3,
    reviewCount: 33,
    stock: 100,
    sku: null,
    features: [
      'Radiance Boost',
      'Gentle Formula',
      'Daily Essentials',
    ],
    tags: ['bundle', 'radiance'],
    isFeatured: false,
  },

  {
    name: 'The Inside-Out Beauty Bundle',
    slug: 'the-inside-out-beauty-bundle',
    price: 44.99,
    originalPrice: 54.99,
    category: 'Bundle',
    description:
      'Nourish your skin from within with this inside-out beauty bundle. Save 18%.',
    images: [
      'https://cutiesglow.com/cdn/shop/files/211_e9d4e25d-747f-43e8-8916-b988561d8321.png?v=1756162629',
    ],
    rating: 4.1,
    reviewCount: 27,
    stock: 100,
    sku: null,
    features: [
      'Inner & Outer Care',
      'Holistic Beauty',
      'Cruelty-Free',
    ],
    tags: ['bundle', 'wellness'],
    isFeatured: false,
  },
];

const uploadFromUrl = async (url, publicId) => {
  const result = await cloudinary.uploader.upload(url, {
    folder: 'cuties-glow/products',
    public_id: publicId,
    resource_type: 'image',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');

    for (const item of PRODUCTS) {
      console.log(`\nProcessing: ${item.name}`);

      // Create/find category
      let category = await Category.findOne({
        slug: slugify(item.category),
      });

      if (!category) {
        category = await Category.create({
          name: item.category,
          slug: slugify(item.category),
          isActive: true,
        });

        console.log(`Category created: ${item.category}`);
      }

      // Prevent duplicate products
      const existing = await Product.findOne({
        slug: item.slug,
      });

      if (existing) {
        console.log(`Already exists: ${item.name}`);
        continue;
      }

      const cloudinaryImages = [];
      const imagePublicIds = [];

      for (let i = 0; i < item.images.length; i++) {
        try {
          const uploaded = await uploadFromUrl(
            item.images[i],
            `${item.slug}-${i + 1}`
          );

          cloudinaryImages.push(uploaded.url);
          imagePublicIds.push(uploaded.publicId);

          console.log(`Image ${i + 1} uploaded`);
        } catch (error) {
          console.error(
            `Failed image ${i + 1}:`,
            error.message
          );
        }
      }

      const product = await Product.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        category: category._id,
        stock: item.stock,
        images: cloudinaryImages,
        imagePublicIds,
        isActive: true,
        isFeatured: item.isFeatured,
        rating: item.rating,
        reviewCount: item.reviewCount,
        sku: item.sku,
        features: item.features,
        tags: item.tags,
      });

      console.log(`Product created: ${product.name}`);
    }

    console.log('\n================================');
    console.log('PRODUCT SEED COMPLETED');
    console.log('================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedProducts();