// backend/src/routes/couponRoutes.js

import express from 'express';
import {
  validateCoupon,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';
import { param, body } from 'express-validator';

const router = express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Validate coupon code
router.get(
  '/validate/:code',
  validate([param('code').notEmpty().withMessage('Coupon code is required')]),
  validateCoupon
);

// ============================================================
// ADMIN ROUTES - ✅ ADDED
// ============================================================

// Get all coupons (admin only)
router.get(
  '/admin',
  auth,
  admin,
  getCoupons
);

// Get single coupon by ID (admin only)
router.get(
  '/admin/:id',
  auth,
  admin,
  validate([param('id').isMongoId().withMessage('Invalid coupon ID')]),
  getCouponById
);

// Create coupon (admin only)
router.post(
  '/admin',
  auth,
  admin,
  validate([
    body('code').notEmpty().withMessage('Coupon code is required'),
    body('type').isIn(['percentage', 'fixed']).withMessage('Invalid coupon type'),
    body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
    body('expiresAt').isISO8601().withMessage('Valid expiry date is required'),
  ]),
  createCoupon
);

// Update coupon (admin only)
router.put(
  '/admin/:id',
  auth,
  admin,
  validate([
    param('id').isMongoId().withMessage('Invalid coupon ID'),
    body('code').optional().notEmpty().withMessage('Coupon code cannot be empty'),
    body('type').optional().isIn(['percentage', 'fixed']).withMessage('Invalid coupon type'),
    body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  ]),
  updateCoupon
);

// Delete coupon (admin only)
router.delete(
  '/admin/:id',
  auth,
  admin,
  validate([param('id').isMongoId().withMessage('Invalid coupon ID')]),
  deleteCoupon
);

export default router;