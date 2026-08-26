// backend/src/routes/videoRoutes.js

import express from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import { admin } from '../middleware/admin.js';
import { validate, commonValidations } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// Admin only routes
router.get('/', admin, getVideos);
router.get('/:id', admin, validate([commonValidations.id('id')]), getVideoById);

router.post(
  '/',
  admin,
  validate([
    body('title').notEmpty().withMessage('Video title is required').isLength({ max: 100 }).trim(),
    body('description').optional({ checkFalsy: true }).isLength({ max: 500 }).trim(),
    body('url').notEmpty().withMessage('Video URL is required').isURL().withMessage('Please enter a valid URL'),
    body('thumbnail').optional({ checkFalsy: true }).isURL().withMessage('Please enter a valid thumbnail URL'),
    body('type').notEmpty().withMessage('Video type is required').isIn(['youtube', 'vimeo', 'instagram', 'custom']).withMessage('Invalid video type'),
    body('productId').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid product ID'),
    body('order').optional().isInt().withMessage('Order must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ]),
  createVideo
);

router.put(
  '/:id',
  admin,
  validate([
    commonValidations.id('id'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty').isLength({ max: 100 }).trim(),
    body('description').optional({ checkFalsy: true }).isLength({ max: 500 }).trim(),
    body('url').optional().isURL().withMessage('Please enter a valid URL'),
    body('thumbnail').optional({ checkFalsy: true }).isURL().withMessage('Please enter a valid thumbnail URL'),
    body('type').optional().isIn(['youtube', 'vimeo', 'instagram', 'custom']).withMessage('Invalid video type'),
    body('productId').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid product ID'),
    body('order').optional().isInt().withMessage('Order must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ]),
  updateVideo
);

router.delete(
  '/:id',
  admin,
  validate([commonValidations.id('id')]),
  deleteVideo
);

export default router;