// backend/src/controllers/analyticsController.js

import catchAsync from '../utils/catchAsync.js';
import * as analyticsService from '../services/analyticsService.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const data = await analyticsService.getDashboardStats();
  res.json({
    success: true,
    data,
  });
});

export const getSalesAnalytics = catchAsync(async (req, res) => {
  const data = await analyticsService.getSalesAnalytics(req.query.period);
  res.json({
    success: true,
    data,
  });
});

export const getTopProducts = catchAsync(async (req, res) => {
  const data = await analyticsService.getTopProducts(req.query.limit);
  res.json({
    success: true,
    data,
  });
});
