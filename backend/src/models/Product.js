// backend/src/models/Product.js

import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Variant name is required'],
      trim: true,
      maxlength: 100,
    },

    price: {
      type: Number,
      required: [true, 'Variant price is required'],
      min: [0, 'Variant price cannot be negative'],
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, 'Variant stock cannot be negative'],
    },

    sku: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },
  },
  {
    _id: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    // ========================================================
    // BASIC INFORMATION
    // ========================================================

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      trim: true,
    },

    // ========================================================
    // PRICING
    // ========================================================

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: null,
    },

    // ========================================================
    // CATEGORY
    // ========================================================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },

    // ========================================================
    // STOCK
    // ========================================================

    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    // ========================================================
    // IMAGES
    // ========================================================

    images: {
      type: [String],
      default: [],
    },

    imagePublicIds: {
      type: [String],
      default: [],
    },

    // ========================================================
    // STATUS
    // ========================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ========================================================
    // STATISTICS
    // ========================================================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // PRODUCT INFORMATION
    // ========================================================

    sku: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },

    features: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    // ========================================================
    // SKINCARE CONTENT
    // ========================================================

    ingredients: {
      type: [String],
      default: [],
    },

    howToUse: {
      type: String,
      default: '',
      trim: true,
    },

    benefits: {
      type: [String],
      default: [],
    },

    // ========================================================
    // VARIANTS
    // ========================================================

    variants: {
      type: [variantSchema],
      default: [],
    },

    // ========================================================
    // SPECIFICATIONS
    // ========================================================

    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// INDEXES
// ============================================================

productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
});

productSchema.index({
  category: 1,
  isActive: 1,
});

productSchema.index({
  isFeatured: 1,
  isActive: 1,
});

productSchema.index({
  soldCount: -1,
});

// ============================================================
// VIRTUAL: DISCOUNT
// ============================================================

productSchema.virtual('discountPercentage').get(function () {
  if (
    this.originalPrice &&
    this.originalPrice > this.price
  ) {
    return Math.round(
      ((this.originalPrice - this.price) /
        this.originalPrice) *
        100
    );
  }

  return 0;
});

// ============================================================
// VIRTUAL: STOCK
// ============================================================

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// ============================================================
// SLUG
// ============================================================

productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  next();
});

// ============================================================
// JSON
// ============================================================

productSchema.set('toJSON', {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;

    ret.id = ret._id.toString();

    return ret;
  },
});

const Product = mongoose.model(
  'Product',
  productSchema
);

export default Product;