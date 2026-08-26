// backend/src/services/analyticsService.js

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const [revenueResult, ordersCount, customersCount, productsCount] = await Promise.all([
      Order.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
    ]);

    const revenue = revenueResult[0]?.total || 0;

    return {
      revenue,
      orders: ordersCount,
      customers: customersCount,
      products: productsCount,
    };
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    throw error;
  }
};

/**
 * Get sales analytics by period
 */
export const getSalesAnalytics = async (period = 'month') => {
  try {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'year':
        startDate = new Date(now.setDate(now.getDate() - 365));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    const salesData = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return salesData;
  } catch (error) {
    logger.error('Get sales analytics error:', error);
    throw error;
  }
};

/**
 * Get top products
 */
export const getTopProducts = async (limit = 5) => {
  try {
    const topProducts = await Product.find()
      .sort({ soldCount: -1 })
      .limit(parseInt(limit))
      .select('name price soldCount images');

    return topProducts;
  } catch (error) {
    logger.error('Get top products error:', error);
    throw error;
  }
};

/**
 * Get order status distribution
 */
export const getOrderStatusDistribution = async () => {
  try {
    const distribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return distribution;
  } catch (error) {
    logger.error('Get order status distribution error:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getSalesAnalytics,
  getTopProducts,
  getOrderStatusDistribution,
};