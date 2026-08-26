// backend/src/routes/beforeAfterRoutes.js

import express from 'express';
import {
  getBeforeAfterItems,
  getBeforeAfterItemById,
  createBeforeAfterItem,
  updateBeforeAfterItem,
  deleteBeforeAfterItem,
  uploadBeforeAfterImages,
} from '../controllers/beforeAfterController.js';
import { admin } from '../middleware/admin.js';
import { validate, commonValidations } from '../middleware/validate.js';
import { uploadMultiple } from '../middleware/upload.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Public route
router.get('/', getBeforeAfterItems);

// Admin only routes
router.get('/:id', admin, validate([commonValidations.id('id')]), getBeforeAfterItemById);

router.post(
  '/images',
  admin,
  uploadMultiple('images', 2),
  uploadBeforeAfterImages
);

router.post(
  '/',
  admin,
  validate([
    body('beforeImage').isURL().withMessage('Valid before image URL is required'),
    body('afterImage').isURL().withMessage('Valid after image URL is required'),
    body('description').isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters'),
  ]),
  createBeforeAfterItem
);

router.put(
  '/:id',
  admin,
  validate([
    commonValidations.id('id'),
    body('beforeImage').optional().isURL().withMessage('Valid before image URL is required'),
    body('afterImage').optional().isURL().withMessage('Valid after image URL is required'),
    body('description').optional().isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters'),
  ]),
  updateBeforeAfterItem
);

router.delete(
  '/:id',
  admin,
  validate([commonValidations.id('id')]),
  deleteBeforeAfterItem
);

export default router;