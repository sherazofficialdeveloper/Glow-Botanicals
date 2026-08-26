// backend/src/validations/userValidation.js

import { body, param } from 'express-validator';

// ============================================================
// ADDRESS VALIDATION
// Used for:
// POST /api/users/addresses
// PUT  /api/users/addresses/:addressId
// ============================================================

export const addressValidation = [
  body('label')
    .optional()
    .isIn(['Home', 'Work', 'Other'])
    .withMessage('Invalid address label'),

  body('street')
    .notEmpty()
    .withMessage('Street address is required')
    .trim(),

  body('city')
    .notEmpty()
    .withMessage('City is required')
    .trim(),

  body('state')
    .notEmpty()
    .withMessage('State is required')
    .trim(),

  body('zip')
    .notEmpty()
    .withMessage('ZIP code is required')
    .trim(),

  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .trim(),
];

// ============================================================
// ADDRESS ID VALIDATION
// ============================================================

export const addressIdValidation = [
  param('addressId')
    .isMongoId()
    .withMessage('Invalid address ID'),
];

// ============================================================
// CHANGE PASSWORD VALIDATION
// ============================================================

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage(
      'New password must be at least 6 characters long'
    ),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      return value === req.body.newPassword;
    })
    .withMessage('Passwords do not match'),
];

// ============================================================
// USER PROFILE UPDATE VALIDATION
// Used for:
// PUT /api/users/profile
// ============================================================

export const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      'Name must be between 2 and 50 characters'
    )
    .trim(),

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage(
      'Please enter a valid phone number'
    ),

  body('avatar')
    .optional()
    .isURL()
    .withMessage(
      'Please enter a valid avatar URL'
    ),
];

// ============================================================
// ALIASES
// Keep these for backward compatibility with existing code.
// ============================================================

export const userProfileValidation =
  updateProfileValidation;

export const addressSchema =
  addressValidation;

export const addressIdSchema =
  addressIdValidation;

export const passwordChangeSchema =
  changePasswordValidation;

export const userProfileSchema =
  updateProfileValidation;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  addressValidation,
  addressIdValidation,
  changePasswordValidation,
  updateProfileValidation,
  userProfileValidation,
};