// backend/src/routes/categoryRoutes.js

import express from 'express';

import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from '../controllers/categoryController.js';

import {
  param,
  query,
} from 'express-validator';

import {
  validate,
} from '../middleware/validate.js';

const router =
  express.Router();

// ============================================================
// GET ALL ACTIVE CATEGORIES
// GET /api/categories
// ============================================================

router.get(
  '/',
  getCategories
);

// ============================================================
// GET CATEGORY BY SLUG
// GET /api/categories/slug/:slug
// ============================================================

router.get(
  '/slug/:slug',

  validate([
    param('slug')
      .trim()
      .notEmpty()
      .withMessage(
        'Slug is required'
      ),
  ]),

  getCategoryBySlug
);

// ============================================================
// GET PRODUCTS BY CATEGORY
// GET /api/categories/:slug/products
// ============================================================

router.get(
  '/:slug/products',

  validate([
    param('slug')
      .trim()
      .notEmpty()
      .withMessage(
        'Slug is required'
      ),

    query('page')
      .optional()
      .isInt({
        min: 1,
      })
      .withMessage(
        'Page must be a positive integer'
      ),

    query('limit')
      .optional()
      .isInt({
        min: 1,
        max: 100,
      })
      .withMessage(
        'Limit must be between 1 and 100'
      ),
  ]),

  getProductsByCategory
);

export default router;