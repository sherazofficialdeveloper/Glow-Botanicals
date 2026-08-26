// backend/src/controllers/authController.js
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  res.json({
    success: true,
    data: { user },
  });
});

export const logout = catchAsync(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  await authService.generateResetToken(req.body.email);
  res.json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent',
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const result = await authService.resetUserPassword(req.body.token, req.body.password);
  res.json({
    success: true,
    message: result?.message || 'Password reset successful',
  });
});

export const sendOTP = catchAsync(async (req, res) => {
  const result = await authService.sendPasswordResetOTP(req.body.email);
  res.json({
    success: true,
    message: result.message,
  });
});

export const verifyOTPAndReset = catchAsync(async (req, res) => {
  const result = await authService.verifyOTPAndResetPassword(
    req.body.email,
    req.body.otp,
    req.body.newPassword
  );
  res.json({
    success: true,
    message: result.message,
  });
});

export const resendOTP = catchAsync(async (req, res) => {
  const result = await authService.resendPasswordResetOTP(req.body.email);
  res.json({
    success: true,
    message: result.message,
  });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const result = await authService.verifyEmail(req.body.token);
  res.json({
    success: true,
    message: result?.message || 'Email verified successfully',
  });
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateUserProfile(req.user.id, req.body);
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

export default {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTPAndReset,
  resendOTP,
  verifyEmail,
  updateProfile,
};