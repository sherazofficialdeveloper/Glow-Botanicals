// backend/src/routes/blogRoutes.js

import express from 'express';
import {
  getPosts,
  getFeaturedPosts,
  searchPosts,
  getPostsByCategory,
  getPostById,
  getPostBySlug,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blogController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { validate, commonValidations } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// ============================================================
// ADMIN (must be registered before the public /:slug route)
// ============================================================

router.get('/admin', auth, admin, getAdminPosts);

router.post(
  '/admin',
  auth,
  admin,
  validate([
    body('title').notEmpty().withMessage('Title is required').isLength({ max: 150 }).trim(),
    body('content').notEmpty().withMessage('Content is required'),
    body('excerpt').optional({ checkFalsy: true }).isLength({ max: 300 }).trim(),
    body('slug').optional({ checkFalsy: true }).trim(),
  ]),
  createPost
);

router.put(
  '/admin/:id',
  auth,
  admin,
  validate([
    commonValidations.id('id'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty').isLength({ max: 150 }).trim(),
    body('excerpt').optional({ checkFalsy: true }).isLength({ max: 300 }).trim(),
  ]),
  updatePost
);

router.delete('/admin/:id', auth, admin, validate([commonValidations.id('id')]), deletePost);

// ============================================================
// PUBLIC
// ============================================================

router.get('/featured', getFeaturedPosts);
router.get('/search', searchPosts);
router.get('/category/:category', getPostsByCategory);
router.get('/id/:id', validate([commonValidations.id('id')]), getPostById);
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

export default router;
