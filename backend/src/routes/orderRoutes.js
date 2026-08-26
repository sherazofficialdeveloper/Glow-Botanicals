// backend/src/routes/orderRoutes.js

import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { admin } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';
import {
  orderValidation,
  orderIdValidation,
  orderStatusValidation,
  orderFilterValidation,
} from '../validations/orderValidation.js';

const router = express.Router();

router.get('/', validate(orderFilterValidation), getOrders);
router.post('/', validate(orderValidation), createOrder);
router.get('/:id', validate(orderIdValidation), getOrder);
router.put(
  '/:id/status',
  admin,
  validate([...orderIdValidation, ...orderStatusValidation]),
  updateOrderStatus
);
router.put('/:id/cancel', validate(orderIdValidation), cancelOrder);

export default router;
