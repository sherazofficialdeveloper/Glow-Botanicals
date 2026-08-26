// backend/src/validations/adminValidation.js

import { body, param, query } from 'express-validator';

// ----- Existing Validations -----
export const categoryValidation = [
  body('name')
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .trim(),
  body('image')
    .optional()
    .isURL().withMessage('Please enter a valid image URL'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

export const categoryIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),
];

export const beforeAfterValidation = [
  body('beforeImage')
    .notEmpty().withMessage('Before image is required')
    .isURL().withMessage('Please enter a valid image URL'),
  body('afterImage')
    .notEmpty().withMessage('After image is required')
    .isURL().withMessage('Please enter a valid image URL'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters')
    .trim(),
];

export const videoValidation = [
  body('title')
    .notEmpty().withMessage('Video title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
    .trim(),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .trim(),
  body('url')
    .notEmpty().withMessage('Video URL is required')
    .isURL().withMessage('Please enter a valid URL'),
  body('thumbnail')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Please enter a valid thumbnail URL'),
  body('type')
    .notEmpty().withMessage('Video type is required')
    .isIn(['youtube', 'vimeo', 'instagram', 'custom']).withMessage('Invalid video type'),
  body('order')
    .optional()
    .isInt().withMessage('Order must be a number'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

export const couponValidation = [
  body('code')
    .notEmpty().withMessage('Coupon code is required')
    .isLength({ min: 3, max: 20 }).withMessage('Code must be between 3 and 20 characters')
    .trim()
    .toUpperCase(),
  body('type')
    .notEmpty().withMessage('Coupon type is required')
    .isIn(['percentage', 'fixed']).withMessage('Invalid coupon type'),
  body('value')
    .notEmpty().withMessage('Coupon value is required')
    .isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('minPurchase')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum purchase must be a positive number'),
  body('maxDiscount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum discount must be a positive number'),
  body('maxUses')
    .optional()
    .isInt({ min: 1 }).withMessage('Max uses must be at least 1'),
  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

export const pageValidation = [
  body('title')
    .notEmpty().withMessage('Page title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
    .trim(),
  body('slug')
    .notEmpty().withMessage('Page slug is required')
    .trim()
    .isSlug().withMessage('Slug must be URL-friendly (only letters, numbers, and hyphens)'),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean'),
];

export const settingsValidation = [
  body('siteName')
    .optional()
    .isString().withMessage('Site name must be a string'),
  body('contactEmail')
    .optional()
    .isEmail().withMessage('Please enter a valid email address'),
  body('paypalMode')
    .optional()
    .isIn(['sandbox', 'live']).withMessage('Invalid PayPal mode'),
  body('freeShippingThreshold')
    .optional()
    .isFloat({ min: 0 }).withMessage('Free shipping threshold must be a positive number'),
  body('standardShippingCost')
    .optional()
    .isFloat({ min: 0 }).withMessage('Shipping cost must be a positive number'),
  body('taxRate')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100'),
];

export const userIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
];

// ✅ FIXED: Matching User model (admin, customer)
export const roleValidation = [
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'customer']).withMessage('Invalid role'),
];

// ----- ALIASES FOR CONTROLLERS -----
export const categorySchema = categoryValidation;
export const beforeAfterSchema = beforeAfterValidation;
export const videoSchema = videoValidation;
export const couponSchema = couponValidation;
export const pageSchema = pageValidation;
export const settingsSchema = settingsValidation;
export const userIdSchema = userIdValidation;
export const roleSchema = roleValidation;