// backend/src/controllers/wishlistController.js

import catchAsync from '../utils/catchAsync.js';
import * as wishlistService from '../services/wishlistService.js';
import { sendFavoriteAddedInBackground } from '../services/emailService.js';

export const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  res.json({
    success: true,
    data: {
      items: wishlist.items || [],
      totalItems: wishlist.items?.length || 0,
    },
  });
});

export const toggleWishlist = catchAsync(async (req, res) => {
  const result = await wishlistService.toggleWishlist(req.user.id, req.body.productId);

  if (result.isAdded) {
    sendFavoriteAddedInBackground(req.user, result.product);
  }
  res.json({
    success: true,
    message: result.isAdded ? 'Added to wishlist' : 'Removed from wishlist',
    data: {
      isAdded: result.isAdded,
      totalItems: result.totalItems,
    },
  });
});

export const syncWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.syncWishlist(req.user.id, req.body.items);
  res.json({
    success: true,
    message: 'Wishlist synced successfully',
    data: {
      items: wishlist.items || [],
      totalItems: wishlist.items?.length || 0,
    },
  });
});
