// backend/src/routes/adminRoutes.js

import express from 'express';

// ============================================================
// ADMIN CONTROLLER
// ============================================================

import {
  getDashboardStats,

  // Users
  getUsers,
  getUserById,
  toggleUserActive,
  deleteUser,

  // Orders
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,

  // Settings
  getSettings,
  updateSettings,

  // Products
  createProduct as createAdminProduct,
  updateProduct as updateAdminProduct,
  deleteProduct as deleteAdminProduct,
} from '../controllers/adminController.js';

// ============================================================
// CATEGORY CONTROLLER
// ============================================================

import {
  getAdminCategories,
  getAdminCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

// ============================================================
// PRODUCT CONTROLLER
// ============================================================

import {
  getProducts as getAdminProducts,
  uploadProductImages,
  deleteProductImage,
} from '../controllers/productController.js';

// ============================================================
// MIDDLEWARE
// ============================================================

import upload from '../middleware/upload.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// ============================================================
// DASHBOARD
// ============================================================

router.get(
  '/dashboard/stats',
  auth,
  admin,
  getDashboardStats
);

// ============================================================
// USER MANAGEMENT
// ============================================================

router.get(
  '/users',
  auth,
  admin,
  getUsers
);

router.get(
  '/users/:id',
  auth,
  admin,
  getUserById
);

// NOTE: intentionally no PUT /users/:id/role route. Per explicit
// product requirement, a user's role must only ever be changed by a
// direct database edit — never through the Admin Panel or any API,
// even by an authenticated admin. This is enforced here by not
// exposing the capability at all, not just by validating it.

router.put(
  '/users/:id/toggle-active',
  auth,
  admin,
  toggleUserActive
);

router.delete(
  '/users/:id',
  auth,
  admin,
  deleteUser
);

// ============================================================
// ORDER MANAGEMENT
// ============================================================

router.get(
  '/orders',
  auth,
  admin,
  getOrders
);

router.get(
  '/orders/:id',
  auth,
  admin,
  getOrderById
);

router.put(
  '/orders/:id/status',
  auth,
  admin,
  updateOrderStatus
);

router.delete(
  '/orders/:id',
  auth,
  admin,
  deleteOrder
);

// ============================================================
// CATEGORY MANAGEMENT
// ============================================================

// GET ALL CATEGORIES
router.get(
  '/categories',
  auth,
  admin,
  getAdminCategories
);

// GET SINGLE CATEGORY
router.get(
  '/categories/:id',
  auth,
  admin,
  getAdminCategory
);

// CREATE CATEGORY
router.post(
  '/categories',
  auth,
  admin,
  createCategory
);

// UPDATE CATEGORY
router.put(
  '/categories/:id',
  auth,
  admin,
  updateCategory
);

// DELETE CATEGORY
router.delete(
  '/categories/:id',
  auth,
  admin,
  deleteCategory
);

// ============================================================
// SETTINGS
// ============================================================

router.get(
  '/settings',
  auth,
  admin,
  getSettings
);

router.put(
  '/settings',
  auth,
  admin,
  updateSettings
);

// ============================================================
// PRODUCT IMAGE UPLOAD
// ============================================================

router.post(
  '/products/images',
  auth,
  admin,
  upload.array('images', 10),
  uploadProductImages
);

router.delete(
  '/products/images',
  auth,
  admin,
  deleteProductImage
);

// ============================================================
// PRODUCT MANAGEMENT
// ============================================================

// GET ALL PRODUCTS
router.get(
  '/products',
  auth,
  admin,
  getAdminProducts
);

// CREATE PRODUCT
router.post(
  '/products',
  auth,
  admin,
  createAdminProduct
);

// UPDATE PRODUCT
router.put(
  '/products/:id',
  auth,
  admin,
  updateAdminProduct
);

// DELETE PRODUCT
router.delete(
  '/products/:id',
  auth,
  admin,
  deleteAdminProduct
);

export default router;