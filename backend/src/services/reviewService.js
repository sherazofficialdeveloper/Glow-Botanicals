// backend/src/services/reviewService.js

import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/error.js';
import logger from '../utils/logger.js';

// ============================================================
// HELPERS
// ============================================================

const escapeRegex = (value) => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getPagination = (page, limit) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  return {
    page: currentPage,
    limit: perPage,
    skip: (currentPage - 1) * perPage,
  };
};

const validateObjectId = (value, label = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

// ============================================================
// RECALCULATE PRODUCT RATING
// ============================================================

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({
    productId,
    isApproved: true,
  }).select('rating');

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount,
  });

  return {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount,
  };
};

// ============================================================
// PUBLIC: GET REVIEWS
// ============================================================

export const getReviews = async (filters = {}) => {
  try {
    const { productId, page = 1, limit = 10 } = filters;

    const { page: currentPage, limit: perPage, skip } = getPagination(page, limit);

    const filter = { isApproved: true };

    if (productId) {
      validateObjectId(productId, 'product ID');
      filter.productId = productId;
    }

    const [reviews, totalCount] = await Promise.all([
      Review.find(filter)
        .populate('productId', 'name slug images price')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
      Review.countDocuments(filter),
    ]);

    return {
      items: reviews,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      currentPage,
      limit: perPage,
    };
  } catch (error) {
    logger.error('Get reviews service error:', error);
    throw error;
  }
};

// ============================================================
// PUBLIC: GET USER REVIEW FOR PRODUCT
// ============================================================

export const getUserReview = async (productId, userId) => {
  try {
    validateObjectId(productId, 'product ID');
    validateObjectId(userId, 'user ID');

    const review = await Review.findOne({
      productId,
      userId,
      reviewerType: 'customer',
    });

    return review || null;
  } catch (error) {
    logger.error('Get user review service error:', error);
    throw error;
  }
};

// ============================================================
// CUSTOMER: LIST OWN REVIEWS
// ============================================================

export const getMyReviews = async (userId, { page = 1, limit = 10 } = {}) => {
  try {
    validateObjectId(userId, 'user ID');
    const skip = (page - 1) * limit;

    const filter = { userId, reviewerType: 'customer' };

    const [rawItems, totalCount] = await Promise.all([
      Review.find(filter)
        .populate('productId', 'name slug images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Review.countDocuments(filter),
    ]);

    // Reshape productId (populated) -> product, matching what the
    // frontend actually reads (same convention used for cart items).
    const items = rawItems.map((review) => {
      const obj = review.toObject();
      obj.product = obj.productId;
      delete obj.productId;
      return obj;
    });

    return {
      items,
      page: parseInt(page, 10),
      total: totalCount,
      totalPages: Math.max(Math.ceil(totalCount / limit), 1),
      limit: parseInt(limit, 10),
    };
  } catch (error) {
    logger.error('Get my reviews service error:', error);
    throw error;
  }
};

// ============================================================
// CUSTOMER: DELETE OWN REVIEW
// ============================================================

export const deleteOwnReview = async (reviewId, userId) => {
  try {
    validateObjectId(reviewId, 'review ID');
    validateObjectId(userId, 'user ID');

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (!review.userId || review.userId.toString() !== userId.toString()) {
      throw new AppError('You can only delete your own reviews', 403);
    }

    await review.deleteOne();
    return { success: true };
  } catch (error) {
    logger.error('Delete own review service error:', error);
    throw error;
  }
};

// ============================================================
// CUSTOMER: CREATE REVIEW
// ============================================================

export const createReview = async (data) => {
  try {
    const { productId, userId, name, email, rating, text, images = [] } = data;

    validateObjectId(productId, 'product ID');
    validateObjectId(userId, 'user ID');

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if user already reviewed this product (customer only)
    const existing = await Review.findOne({
      productId,
      userId,
      reviewerType: 'customer',
    });

    if (existing) {
      throw new AppError('You have already reviewed this product', 409);
    }

    // Validate rating
    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Validate text
    if (!text?.trim() || text.trim().length < 5) {
      throw new AppError('Review must be at least 5 characters', 400);
    }

    const review = await Review.create({
      productId,
      userId,
      reviewerType: 'customer',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      rating: Number(rating),
      text: text.trim(),
      isApproved: false, // Customer reviews need admin approval
      images: Array.isArray(images) ? images : [],
    });

    return review;
  } catch (error) {
    logger.error('Create review service error:', error);
    throw error;
  }
};

// ============================================================
// ADMIN: GET ALL REVIEWS
// ============================================================

export const getAdminReviews = async (filters = {}) => {
  try {
    const { page = 1, limit = 10, status, productId, search } = filters;

    const { page: currentPage, limit: perPage, skip } = getPagination(page, limit);

    const filter = {};

    if (status && status !== 'all') {
      if (!['approved', 'pending', 'rejected'].includes(status)) {
        throw new AppError('Invalid review status', 400);
      }
      if (status === 'approved') {
        filter.isApproved = true;
        filter.isRejected = { $ne: true };
      } else if (status === 'rejected') {
        filter.isApproved = false;
        filter.isRejected = true;
      } else {
        filter.isApproved = false;
        filter.isRejected = { $ne: true };
      }
    }

    if (productId) {
      validateObjectId(productId, 'product ID');
      filter.productId = productId;
    }

    if (search?.trim()) {
      const safeSearch = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { text: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const [reviews, totalCount] = await Promise.all([
      Review.find(filter)
        .populate('productId', 'name slug images price')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
      Review.countDocuments(filter),
    ]);

    const items = reviews.map((review) => ({
      ...review,
      product: review.productId,
      user: review.userId,
    }));

    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      currentPage,
      limit: perPage,
    };
  } catch (error) {
    logger.error('Get admin reviews service error:', error);
    throw error;
  }
};

// ============================================================
// ADMIN: GET SINGLE REVIEW
// ============================================================

export const getAdminReview = async (reviewId) => {
  try {
    validateObjectId(reviewId, 'review ID');

    const review = await Review.findById(reviewId)
      .populate('productId', 'name slug images price')
      .populate('userId', 'name email');

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    const item = review.toObject();
    item.product = item.productId;
    item.user = item.userId;

    return item;
  } catch (error) {
    logger.error('Get admin review service error:', error);
    throw error;
  }
};

// ============================================================
// ADMIN: CREATE REVIEW (Admin can create multiple)
// ============================================================

export const createAdminReview = async (data) => {
  try {
    const { productId, userId, name, email, rating, text, isApproved = true, images = [] } = data;

    validateObjectId(productId, 'product ID');

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // If userId is provided, validate it
    let finalUserId = userId;
    if (userId) {
      validateObjectId(userId, 'user ID');
    } else {
      // If no userId, create review without user association
      finalUserId = null;
    }

    // Validate name
    if (!name?.trim()) {
      throw new AppError('Reviewer name is required', 400);
    }

    // Validate email
    if (!email?.trim()) {
      throw new AppError('Reviewer email is required', 400);
    }

    // Validate rating
    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Validate text
    if (!text?.trim() || text.trim().length < 5) {
      throw new AppError('Review must be at least 5 characters', 400);
    }

    // Admin can create review even if user already reviewed (reviewerType: admin)
    const review = await Review.create({
      productId,
      userId: finalUserId,
      reviewerType: 'admin',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      rating: Number(rating),
      text: text.trim(),
      isApproved: Boolean(isApproved),
      isRejected: false,
      images: Array.isArray(images) ? images : [],
    });

    // Recalculate product rating if approved
    if (review.isApproved) {
      await recalculateProductRating(productId);
    }

    return review;
  } catch (error) {
    logger.error('Create admin review service error:', error);
    throw error;
  }
};

// ============================================================
// ADMIN: UPDATE REVIEW
// ============================================================

export const updateReview = async (reviewId, data) => {
  try {
    validateObjectId(reviewId, 'review ID');

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    const oldProductId = review.productId.toString();

    const { productId, name, email, rating, text, isApproved, images } = data;

    // Update product if changed
    if (productId && productId !== oldProductId) {
      validateObjectId(productId, 'product ID');
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      review.productId = productId;
    }

    // Update fields
    if (name !== undefined) {
      if (!name.trim()) throw new AppError('Reviewer name cannot be empty', 400);
      review.name = name.trim();
    }

    if (email !== undefined) {
      if (!email.trim()) throw new AppError('Reviewer email cannot be empty', 400);
      review.email = email.trim().toLowerCase();
    }

    if (rating !== undefined) {
      if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }
      review.rating = Number(rating);
    }

    if (text !== undefined) {
      if (!text.trim() || text.trim().length < 5) {
        throw new AppError('Review must be at least 5 characters', 400);
      }
      review.text = text.trim();
    }

    if (isApproved !== undefined) {
      review.isApproved = Boolean(isApproved);
      if (review.isApproved) review.isRejected = false;
    }

    if (data.isRejected !== undefined) {
      review.isRejected = Boolean(data.isRejected);
      if (review.isRejected) review.isApproved = false;
    }

    if (images !== undefined) {
      review.images = Array.isArray(images) ? images : [];
    }

    await review.save();

    // Recalculate both old and new product ratings
    if (productId && productId !== oldProductId) {
      await recalculateProductRating(oldProductId);
    }
    await recalculateProductRating(review.productId);

    return review;
  } catch (error) {
    logger.error('Update review service error:', error);
    throw error;
  }
};

// ============================================================
// ADMIN: APPROVE REVIEW
// ============================================================

export const approveReview = async (reviewId) => {
  try {
    validateObjectId(reviewId, 'review ID');

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.isApproved) {
      return review;
    }

    review.isApproved = true;
    review.isRejected = false;
    await review.save();

    await recalculateProductRating(review.productId);

    return review;
  } catch (error) {
    logger.error('Approve review service error:', error);
    throw error;
  }
};

// ============================================================
// ADMIN: UNAPPROVE REVIEW
// ============================================================

export const unapproveReview = async (reviewId) => {
  try {
    validateObjectId(reviewId, 'review ID');

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (!review.isApproved) {
      return review;
    }

    review.isApproved = false;
    review.isRejected = false;
    await review.save();

    await recalculateProductRating(review.productId);

    return review;
  } catch (error) {
    logger.error('Unapprove review service error:', error);
    throw error;
  }
};

// ============================================================
// ADMIN: REJECT REVIEW
// ============================================================

export const rejectReview = async (reviewId) => {
  try {
    validateObjectId(reviewId, 'review ID');

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    review.isApproved = false;
    review.isRejected = true;
    await review.save();

    await recalculateProductRating(review.productId);

    return review;
  } catch (error) {
    logger.error('Reject review service error:', error);
    throw error;
  }
};
// ============================================================
// ADMIN: DELETE REVIEW
// ============================================================

export const deleteReview = async (reviewId) => {
  try {
    validateObjectId(reviewId, 'review ID');

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    const productId = review.productId;

    await review.deleteOne();

    await recalculateProductRating(productId);

    return true;
  } catch (error) {
    logger.error('Delete review service error:', error);
    throw error;
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getReviews,
  getUserReview,
  getMyReviews,
  deleteOwnReview,
  createReview,
  getAdminReviews,
  getAdminReview,
  createAdminReview,
  updateReview,
  approveReview,
  unapproveReview,
  rejectReview,
  deleteReview,
};