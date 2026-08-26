// backend/src/routes/wishlistRoutes.js

import express from 'express';
import {
  getWishlist,
  toggleWishlist,
  syncWishlist,
} from '../controllers/wishlistController.js';
import { auth } from '../middleware/auth.js';
import { validate, commonValidations } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// All wishlist routes require authentication
router.get('/', auth, getWishlist);

router.post(
  '/toggle',
  auth,
  validate([
    body('productId').isMongoId().withMessage('Invalid product ID'),
  ]),
  toggleWishlist
);

router.post(
  '/sync',
  auth,
  validate([body('items').isArray().withMessage('Items must be an array')]),
  syncWishlist
);

export default router;