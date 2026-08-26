import express from 'express';

import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  createReview,
} from '../controllers/productController.js';

import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

import {
  uploadMultiple,
} from '../config/multer.js';

import {
  validate,
} from '../middleware/validate.js';

import {
  productValidation,
  productIdValidation,
  productSlugValidation,
  productFilterValidation,
  reviewValidation,
} from '../validations/productValidation.js';

const router = express.Router();

// ============================================================
// PUBLIC PRODUCT ROUTES
// ============================================================

// GET /api/products
router.get(
  '/',
  validate(productFilterValidation),
  getProducts
);

// GET /api/products/featured
router.get(
  '/featured',
  getFeaturedProducts
);

// GET /api/products/slug/:slug
router.get(
  '/slug/:slug',
  validate(productSlugValidation),
  getProductBySlug
);

// GET /api/products/:id/related
router.get(
  '/:id/related',
  validate(productIdValidation),
  getRelatedProducts
);

// ============================================================
// PRODUCT IMAGE ROUTES
// ============================================================

// POST /api/products/images
router.post(
  '/images',
  auth,
  admin,
  uploadMultiple('images', 10),
  uploadProductImages
);

// DELETE /api/products/images
router.delete(
  '/images',
  auth,
  admin,
  deleteProductImage
);

// ============================================================
// ADMIN PRODUCT ROUTES
// ============================================================

// POST /api/products
router.post(
  '/',
  auth,
  admin,
  validate(productValidation),
  createProduct
);

// PUT /api/products/:id
router.put(
  '/:id',
  auth,
  admin,
  validate([
    ...productIdValidation,
    ...productValidation,
  ]),
  updateProduct
);

// DELETE /api/products/:id
router.delete(
  '/:id',
  auth,
  admin,
  validate(productIdValidation),
  deleteProduct
);

// ============================================================
// GET PRODUCT BY ID
// ============================================================

// GET /api/products/:id
router.get(
  '/:id',
  validate(productIdValidation),
  getProductById
);

// ============================================================
// PRODUCT REVIEWS
// ============================================================

// POST /api/products/:id/reviews
router.post(
  '/:id/reviews',
  auth,
  validate([
    ...productIdValidation,
    ...reviewValidation,
  ]),
  createReview
);

export default router;