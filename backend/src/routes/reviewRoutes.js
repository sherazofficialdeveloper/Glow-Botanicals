import express from 'express';

import {
  getReviews,
  getUserReview,
  getMyReviews,
  createReview,
  deleteOwnReview,
  getAdminReviews,
  getAdminReview,
  createAdminReview,
  updateReview,
  approveReview,
  unapproveReview,
  deleteReview,
} from '../controllers/reviewController.js';

import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

import {
  validate,
  commonValidations,
} from '../middleware/validate.js';

import {
  query,
  body,
  param,
} from 'express-validator';

const router = express.Router();

// ============================================================
// PUBLIC REVIEWS
// ============================================================

router.get(
  '/',
  validate([
    query('productId')
      .optional()
      .isMongoId()
      .withMessage(
        'Invalid product ID'
      ),

    commonValidations.page('page'),
    commonValidations.limit('limit'),
  ]),
  getReviews
);

// ============================================================
// CUSTOMER REVIEWS
// ============================================================

router.get(
  '/my-review/:productId',
  auth,
  validate([
    param('productId')
      .isMongoId()
      .withMessage(
        'Invalid product ID'
      ),
  ]),
  getUserReview
);

// Customer: list all of my own reviews (across all products)
router.get(
  '/my-reviews',
  auth,
  getMyReviews
);

// Customer: delete my own review (ownership enforced in the service layer)
router.delete(
  '/my-reviews/:id',
  auth,
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID'),
  ]),
  deleteOwnReview
);

router.post(
  '/',
  auth,
  validate([
    body('productId')
      .isMongoId()
      .withMessage(
        'Invalid product ID'
      ),

    body('rating')
      .isInt({
        min: 1,
        max: 5,
      })
      .withMessage(
        'Rating must be between 1 and 5'
      ),

    body('text')
      .trim()
      .isLength({
        min: 5,
        max: 1000,
      })
      .withMessage(
        'Review must be between 5 and 1000 characters'
      ),
  ]),
  createReview
);

// ============================================================
// ADMIN REVIEWS
// ============================================================

// Get all reviews
router.get(
  '/admin',
  auth,
  admin,
  validate([
    commonValidations.page('page'),
    commonValidations.limit('limit'),

    query('status')
      .optional()
      .isIn([
        'all',
        'pending',
        'approved',
      ])
      .withMessage(
        'Invalid review status'
      ),

    query('productId')
      .optional()
      .isMongoId()
      .withMessage(
        'Invalid product ID'
      ),

    query('search')
      .optional()
      .isString()
      .withMessage(
        'Search must be a string'
      )
      .trim(),
  ]),
  getAdminReviews
);

// Get single review
router.get(
  '/admin/:id',
  auth,
  admin,
  validate([
    param('id')
      .isMongoId()
      .withMessage(
        'Invalid review ID'
      ),
  ]),
  getAdminReview
);

// Create admin review
//
// IMPORTANT:
// No userId is accepted from frontend.
// Backend automatically uses req.user.id.
router.post(
  '/admin',
  auth,
  admin,
  validate([
    body('productId')
      .isMongoId()
      .withMessage(
        'Invalid product ID'
      ),

    body('name')
      .trim()
      .isLength({
        min: 2,
        max: 100,
      })
      .withMessage(
        'Name must be between 2 and 100 characters'
      ),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage(
        'Valid email is required'
      ),

    body('rating')
      .isInt({
        min: 1,
        max: 5,
      })
      .withMessage(
        'Rating must be between 1 and 5'
      ),

    body('text')
      .trim()
      .isLength({
        min: 5,
        max: 1000,
      })
      .withMessage(
        'Review must be between 5 and 1000 characters'
      ),

    body('isApproved')
      .optional()
      .isBoolean()
      .withMessage(
        'isApproved must be boolean'
      ),
  ]),
  createAdminReview
);

// Update review
//
// userId and reviewerType are NOT accepted.
// They must remain unchanged.
router.put(
  '/admin/:id',
  auth,
  admin,
  validate([
    param('id')
      .isMongoId()
      .withMessage(
        'Invalid review ID'
      ),

    body('name')
      .optional()
      .trim()
      .isLength({
        min: 2,
        max: 100,
      })
      .withMessage(
        'Name must be between 2 and 100 characters'
      ),

    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage(
        'Invalid email'
      ),

    body('rating')
      .optional()
      .isInt({
        min: 1,
        max: 5,
      })
      .withMessage(
        'Rating must be between 1 and 5'
      ),

    body('text')
      .optional()
      .trim()
      .isLength({
        min: 5,
        max: 1000,
      })
      .withMessage(
        'Review must be between 5 and 1000 characters'
      ),

    body('productId')
      .optional()
      .isMongoId()
      .withMessage(
        'Invalid product ID'
      ),

    body('isApproved')
      .optional()
      .isBoolean()
      .withMessage(
        'isApproved must be boolean'
      ),
  ]),
  updateReview
);

// Approve
router.put(
  '/admin/:id/approve',
  auth,
  admin,
  validate([
    param('id')
      .isMongoId()
      .withMessage(
        'Invalid review ID'
      ),
  ]),
  approveReview
);

// Unapprove
router.put(
  '/admin/:id/unapprove',
  auth,
  admin,
  validate([
    param('id')
      .isMongoId()
      .withMessage(
        'Invalid review ID'
      ),
  ]),
  unapproveReview
);

// Reject (alias for unapprove — the admin panel's "reject" action hits this path)
router.put(
  '/admin/:id/reject',
  auth,
  admin,
  validate([
    param('id')
      .isMongoId()
      .withMessage(
        'Invalid review ID'
      ),
  ]),
  unapproveReview
);

// Delete
router.delete(
  '/admin/:id',
  auth,
  admin,
  validate([
    param('id')
      .isMongoId()
      .withMessage(
        'Invalid review ID'
      ),
  ]),
  deleteReview
);

export default router;