// backend/src/routes/authRoutes.js

import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendOTP,
  verifyOTPAndReset,
  resendOTP,
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../config/rateLimit.js';
import {
   registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
  sendOTPValidation,
  resetPasswordOTPValidation,
  resendOTPValidation,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerValidation), register);
router.post('/login', authLimiter, validate(loginValidation), login);
router.post('/logout', auth, logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordValidation), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordValidation), resetPassword);
router.post('/verify-email', validate(verifyEmailValidation), verifyEmail);
router.post('/forgot-password-otp', authLimiter, validate(sendOTPValidation), sendOTP);
router.post('/reset-password-otp', authLimiter, validate(resetPasswordOTPValidation), verifyOTPAndReset);
router.post('/resend-otp', authLimiter, validate(resendOTPValidation), resendOTP);

export default router;
