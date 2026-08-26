//  backend/src/services/wishlistService.js

import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/error.js';
import { logger } from '../utils/logger.js';

/**
 * Get user wishlist
 */
export const getWishlist = async (userId) => {
  try {
    let wishlist = await Wishlist.findOne({ userId }).populate(
      'items',
      'name price images slug stock isActive'
    );

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [],
      });

      await wishlist.save();
    }

    return wishlist;
  } catch (error) {
    logger.error('Get wishlist service error:', error);
    throw error;
  }
};

/**
 * Toggle wishlist item
 */
export const toggleWishlist = async (userId, productId) => {
  try {
    // Make sure product exists
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Optional safety check
    if (product.isActive === false) {
      throw new AppError('This product is not available.', 400);
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [],
      });
    }

    // IMPORTANT:
    // Compare ObjectId values as strings.
    const index = wishlist.items.findIndex(
      (item) => item.toString() === productId.toString()
    );

    let isAdded = false;

    if (index === -1) {
      wishlist.items.push(product._id);
      isAdded = true;
    } else {
      wishlist.items.splice(index, 1);
      isAdded = false;
    }

    await wishlist.save();

    return {
      message: isAdded
        ? 'Product added to your wishlist.'
        : 'Product removed from your wishlist.',
      isAdded,
      totalItems: wishlist.items.length,
    };
  } catch (error) {
    logger.error('Toggle wishlist service error:', error);
    throw error;
  }
};

/**
 * Sync wishlist
 */
export const syncWishlist = async (userId, items) => {
  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [],
      });
    }

    const serverItems = new Set(
      wishlist.items.map((id) => id.toString())
    );

    const clientItems = new Set(
      Array.isArray(items)
        ? items.map((id) => id.toString())
        : []
    );

    for (const id of clientItems) {
      if (!serverItems.has(id)) {
        const product = await Product.findById(id);

        if (product && product.isActive !== false) {
          wishlist.items.push(product._id);
        }
      }
    }

    await wishlist.save();

    await wishlist.populate(
      'items',
      'name price images slug stock isActive'
    );

    return wishlist;
  } catch (error) {
    logger.error('Sync wishlist service error:', error);
    throw error;
  }
};

export default {
  getWishlist,
  toggleWishlist,
  syncWishlist,
};

