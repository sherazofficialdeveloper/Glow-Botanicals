// backend/src/routes/paymentRoutes.js

import express from 'express';
import {
  listPaymentMethods,
  createPayPalOrder,
  capturePayPalOrder,
  createStripePaymentIntent,
  captureStripePayment,
} from '../controllers/paymentController.js';
import { auth } from '../middleware/index.js';
import { validate, commonValidations } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/methods', listPaymentMethods);

router.post(
  '/paypal/create',
  auth,
  validate([body('orderId').isMongoId().withMessage('Valid order ID is required')]),
  createPayPalOrder
);

router.post(
  '/paypal/capture/:orderId',
  auth,
  validate([commonValidations.id('orderId')]),
  capturePayPalOrder
);

router.post(
  '/stripe/create-intent',
  auth,
  validate([body('orderId').isMongoId().withMessage('Valid order ID is required')]),
  createStripePaymentIntent
);

router.post(
  '/stripe/capture/:orderId',
  auth,
  validate([commonValidations.id('orderId')]),
  captureStripePayment
);

export default router;
