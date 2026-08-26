// backend/src/routes/analyticsRoutes.js

import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics,
  getTopProducts,
} from '../controllers/analyticsController.js';
import { admin } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';
import { query } from 'express-validator';

const router = express.Router();

// Admin only routes
router.get('/dashboard', admin, getDashboardStats);

router.get(
  '/sales',
  admin,
  validate([query('period').optional().isString()]),
  getSalesAnalytics
);

router.get(
  '/top-products',
  admin,
  validate([query('limit').optional().isInt({ min: 1, max: 10 })]),
  getTopProducts
);

export default router;