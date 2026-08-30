import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    // The actual account that created the review.
    // Customer review = customer user ID.
    // Admin review = admin user ID.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Used to distinguish customer reviews from admin-created reviews.
    // This is important because:
    // - customers can review a product only once
    // - admins can create multiple reviews for the same product
    reviewerType: {
      type: String,
      enum: ['customer', 'admin'],
      required: true,
      index: true,
    },

    // Snapshot/display information.
    // Admin can change these values independently from the User account.
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    text: {
      type: String,
      required: true,
      minlength: [5, 'Review must be at least 5 characters'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
      trim: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    isRejected: {
      type: Boolean,
      default: false,
      index: true,
    },

    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Public/product queries
reviewSchema.index({
  productId: 1,
  isApproved: 1,
});

// Customer duplicate protection only.
// IMPORTANT:
// This index applies ONLY to customer reviews.
// Admin reviews are not included.
reviewSchema.index(
  {
    productId: 1,
    userId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      reviewerType: 'customer',
    },
  }
);

// Useful for admin/user lookup
reviewSchema.index({
  userId: 1,
  reviewerType: 1,
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;