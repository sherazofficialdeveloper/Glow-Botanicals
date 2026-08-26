import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC INFORMATION
    // ============================================================

    name: {
      type: String,
      required: [
        true,
        'Category name is required',
      ],
      trim: true,
      minlength: [
        2,
        'Category name must be at least 2 characters',
      ],
      maxlength: [
        50,
        'Category name cannot exceed 50 characters',
      ],
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
      trim: true,
      maxlength: [
        500,
        'Category description cannot exceed 500 characters',
      ],
      default: '',
    },

    // ============================================================
    // IMAGE
    // ============================================================

    image: {
      type: String,
      trim: true,
      default: null,
    },

    imagePublicId: {
      type: String,
      trim: true,
      default: null,
    },

    // ============================================================
    // STATUS
    // ============================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ============================================================
    // DISPLAY ORDER
    // ============================================================

    sortOrder: {
      type: Number,
      min: [
        0,
        'Sort order cannot be negative',
      ],
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// INDEXES
// ============================================================

categorySchema.index({
  isActive: 1,
  sortOrder: 1,
  name: 1,
});

// ============================================================
// JSON TRANSFORM
// ============================================================

categorySchema.set('toJSON', {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;

    // Keep MongoDB's canonical _id.
    // Provide id only as a frontend-friendly alias.
    if (ret._id) {
      ret.id =
        ret._id.toString();
    }

    return ret;
  },
});

const Category =
  mongoose.model(
    'Category',
    categorySchema
  );

export default Category;