// backend/src/routes/userRoutes.js

import express from 'express';

import {
  getMe,
  updateProfile,
  uploadAvatar,
  changePassword,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/userController.js';

import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadSingle } from '../middleware/upload.js';

import {
  userProfileValidation,
  changePasswordValidation,
  addressValidation,
  addressIdValidation,
} from '../validations/userValidation.js';

const router = express.Router();

// ============================================================
// ALL USER ROUTES REQUIRE AUTHENTICATION
// ============================================================

router.use(auth);

// ============================================================
// PROFILE
// ============================================================

// GET /api/users/me
router.get(
  '/me',
  getMe
);

// PUT /api/users/profile
router.put(
  '/profile',
  validate(userProfileValidation),
  updateProfile
);

// POST /api/users/avatar
router.post(
  '/avatar',
  uploadSingle('avatar'),
  uploadAvatar
);

// ============================================================
// PASSWORD
// ============================================================

// PUT /api/users/change-password
router.put(
  '/change-password',
  validate(changePasswordValidation),
  changePassword
);

// ============================================================
// ADDRESSES
// ============================================================

// GET /api/users/addresses
router.get(
  '/addresses',
  getUserAddresses
);

// POST /api/users/addresses
router.post(
  '/addresses',
  validate(addressValidation),
  addAddress
);

// PUT /api/users/addresses/:addressId
router.put(
  '/addresses/:addressId',
  validate([
    ...addressIdValidation,
    ...addressValidation,
  ]),
  updateAddress
);

// DELETE /api/users/addresses/:addressId
router.delete(
  '/addresses/:addressId',
  validate(addressIdValidation),
  deleteAddress
);

// PUT /api/users/addresses/:addressId/default
router.put(
  '/addresses/:addressId/default',
  validate(addressIdValidation),
  setDefaultAddress
);

export default router;