// backend/src/routes/faqRoutes.js

import express from 'express';
import {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { validate, commonValidations } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// Public
router.get('/', getFAQs);
router.get('/:id', validate([commonValidations.id('id')]), getFAQById);

// Admin
router.post(
  '/',
  auth,
  admin,
  validate([
    body('question').notEmpty().withMessage('Question is required').isLength({ max: 300 }).trim(),
    body('answer').notEmpty().withMessage('Answer is required').trim(),
    body('category').optional({ checkFalsy: true }).trim(),
    body('order').optional().isInt().withMessage('Order must be a number'),
  ]),
  createFAQ
);

router.put(
  '/:id',
  auth,
  admin,
  validate([
    commonValidations.id('id'),
    body('question').optional().notEmpty().withMessage('Question cannot be empty').isLength({ max: 300 }).trim(),
    body('answer').optional().notEmpty().withMessage('Answer cannot be empty').trim(),
    body('order').optional().isInt().withMessage('Order must be a number'),
  ]),
  updateFAQ
);

router.delete('/:id', auth, admin, validate([commonValidations.id('id')]), deleteFAQ);

export default router;
