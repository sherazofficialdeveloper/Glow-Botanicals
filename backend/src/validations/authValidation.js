// backend/src/validations/authValidation.js
import { body } from 'express-validator';

// ============================================================
// COMMON PASSWORD RULES
// ============================================================

const passwordRules = (field = 'password') =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isString()
    .withMessage(`${field} must be a string`)
    .isLength({ min: 6, max: 128 })
    .withMessage(`${field} must be between 6 and 128 characters`);

// ============================================================
// REGISTER
// ============================================================

export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('phone')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Phone must be a string')
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone must be between 7 and 20 characters'),
];

// ============================================================
// LOGIN
// ============================================================

export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
];

// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPasswordValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),
];

// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isString()
    .withMessage('Reset token must be a string')
    .trim(),

  passwordRules('password'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .isString()
    .withMessage('Confirm password must be a string')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords do not match'),
];

// ============================================================
// EMAIL VERIFICATION
// ============================================================

export const verifyEmailValidation = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .isString()
    .withMessage('Verification token must be a string')
    .trim(),
];

// ============================================================
// UPDATE PROFILE
// ============================================================

export const updateProfileValidation = [
  body('name')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),

  body('phone')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Phone must be a string')
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone must be between 7 and 20 characters'),

  body('avatar')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('Please enter a valid avatar URL')
    .trim(),
];

// ============================================================
// OTP PASSWORD RESET
// ============================================================

export const sendOTPValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),
];

export const resendOTPValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),
];

export const resetPasswordOTPValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),

  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isString()
    .withMessage('OTP must be a string')
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit code'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters'),

  body('confirmPassword')
    .optional()
    .isString()
    .withMessage('Confirm password must be a string')
    .custom((value, { req }) => {
      return value === req.body.newPassword;
    })
    .withMessage('Passwords do not match'),
];

// ============================================================
// ALIASES
// ============================================================

export const registerSchema = registerValidation;
export const loginSchema = loginValidation;
export const forgotPasswordSchema = forgotPasswordValidation;
export const resetPasswordSchema = resetPasswordValidation;
export const verifyEmailSchema = verifyEmailValidation;
export const updateProfileSchema = updateProfileValidation;
export const sendOTPSchema = sendOTPValidation;
export const resendOTPSchema = resendOTPValidation;
export const resetPasswordOTPSchema = resetPasswordOTPValidation;

export default {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
  updateProfileValidation,
  sendOTPValidation,
  resendOTPValidation,
  resetPasswordOTPValidation,
};