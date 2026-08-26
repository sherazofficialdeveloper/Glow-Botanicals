// backend/src/validations/orderValidation.js

import { body, param, query } from 'express-validator';

export const orderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress')
    .notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.name')
    .notEmpty().withMessage('Shipping name is required')
    .trim(),
  body('shippingAddress.street')
    .notEmpty().withMessage('Street is required')
    .trim(),
  body('shippingAddress.city')
    .notEmpty().withMessage('City is required')
    .trim(),
  body('shippingAddress.state')
    .notEmpty().withMessage('State is required')
    .trim(),
  body('shippingAddress.zip')
    .notEmpty().withMessage('ZIP code is required')
    .trim(),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['paypal', 'stripe', 'cod', 'afterpay', 'klarna']).withMessage('Invalid payment method'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim(),
  body('couponCode')
    .optional()
    .isString().withMessage('Invalid coupon code'),
];

export const orderIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid order ID'),
];

export const orderStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

export const orderFilterValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
    .toInt(),
  query('status')
    .optional()
    .isIn(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

// ----- ALIASES FOR CONTROLLERS (ADD THESE) -----
export const orderSchema = orderValidation;
export const orderIdSchema = orderIdValidation;
export const orderStatusSchema = orderStatusValidation;
export const orderFilterSchema = orderFilterValidation;