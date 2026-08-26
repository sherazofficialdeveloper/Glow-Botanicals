// backend/src/services/userService.js

import User from '../models/User.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { AppError } from '../utils/error.js';
import logger from '../utils/logger.js';

/**
 * Get user addresses
 */
export const getUserAddresses = async (userId) => {
  try {
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user.addresses || [];
  } catch (error) {
    logger.error('Get addresses service error:', error);
    throw error;
  }
};

/**
 * Add address to user
 */
export const addUserAddress = async (userId, addressData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { label, street, city, state, zip, country, isDefault } = addressData;

    const shouldBeDefault = user.addresses.length === 0 ? true : Boolean(isDefault);

    if (shouldBeDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      street,
      city,
      state,
      zip,
      country,
      isDefault: shouldBeDefault,
    });
    await user.save();

    return user.addresses[user.addresses.length - 1];
  } catch (error) {
    logger.error('Add address service error:', error);
    throw error;
  }
};

/**
 * Update address
 */
export const updateUserAddress = async (userId, addressId, addressData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw new AppError('Address not found', 404);
    }

    const { label, street, city, state, zip, country, isDefault } = addressData;

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      label,
      street,
      city,
      state,
      zip,
      country,
      isDefault,
    };

    await user.save();

    return user.addresses[addressIndex];
  } catch (error) {
    logger.error('Update address service error:', error);
    throw error;
  }
};

/**
 * Delete address
 */
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw new AppError('Address not found', 404);
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    return true;
  } catch (error) {
    logger.error('Delete address service error:', error);
    throw error;
  }
};

/**
 * Set default address
 */
export const setDefaultUserAddress = async (userId, addressId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      throw new AppError('Address not found', 404);
    }

    user.addresses.forEach(addr => addr.isDefault = false);
    user.addresses[addressIndex].isDefault = true;
    await user.save();

    return true;
  } catch (error) {
    logger.error('Set default address service error:', error);
    throw error;
  }
};

/**
 * Get user statistics
 */
export const getUserStatistics = async (userId) => {
  try {
    const orderStats = await Order.aggregate([
      { $match: { userId, status: { $in: ['paid', 'delivered'] } } },
      { $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
      } },
    ]);

    const reviewCount = await Review.countDocuments({ userId });

    return {
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0,
      reviewCount: reviewCount || 0,
    };
  } catch (error) {
    logger.error('Get user statistics service error:', error);
    throw error;
  }
};

export default {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
  getUserStatistics,
};