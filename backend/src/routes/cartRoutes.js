// backend/src/routes/cartRoutes.js

import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  syncCart,
  clearCart,
} from '../controllers/cartController.js';
import { auth } from '../middleware/auth.js';
import { validate, commonValidations } from '../middleware/validate.js';
import { body, param } from 'express-validator';

const router = express.Router();

// All cart routes require authentication
router.get('/', auth, getCart);

router.post(
  '/',
  auth,
  validate([
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ]),
  addToCart
);

router.put(
  '/:itemId',
  auth,
  validate([
    commonValidations.id('itemId'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative'),
  ]),
  updateCartItem
);

router.delete(
  '/:itemId',
  auth,
  validate([commonValidations.id('itemId')]),
  removeFromCart
);

router.post(
  '/sync',
  auth,
  validate([body('items').isArray().withMessage('Items must be an array')]),
  syncCart
);

router.delete('/', auth, clearCart);

export default router;