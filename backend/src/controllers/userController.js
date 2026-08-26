// backend/src/controllers/userController.js

import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import { uploadImage } from '../utils/cloudinaryUpload.js';
import { AppError } from '../utils/error.js';

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  res.json({
    success: true,
    data: { user },
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

export const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please select an image to upload', 400);
  }

  const uploaded = await uploadImage(req.file.buffer, 'glow-botanical/avatars');
  const updatedUser = await authService.updateUserAvatar(req.user.id, uploaded.url, uploaded.publicId);

  res.json({
    success: true,
    message: 'Profile image updated successfully',
    data: { user: updatedUser },
  });
});

export const changePassword = catchAsync(async (req, res) => {  await authService.changeUserPassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const getUserAddresses = catchAsync(async (req, res) => {
  const addresses = await userService.getUserAddresses(req.user.id);
  res.json({
    success: true,
    data: { addresses },
  });
});

export const addAddress = catchAsync(async (req, res) => {
  const address = await userService.addUserAddress(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: { address },
  });
});

export const updateAddress = catchAsync(async (req, res) => {
  const address = await userService.updateUserAddress(
    req.user.id,
    req.params.addressId,
    req.body
  );
  res.json({
    success: true,
    message: 'Address updated successfully',
    data: { address },
  });
});

export const deleteAddress = catchAsync(async (req, res) => {
  await userService.deleteUserAddress(req.user.id, req.params.addressId);
  res.json({
    success: true,
    message: 'Address deleted successfully',
  });
});

export const setDefaultAddress = catchAsync(async (req, res) => {
  await userService.setDefaultUserAddress(req.user.id, req.params.addressId);
  const addresses = await userService.getUserAddresses(req.user.id);
  const address = addresses.find((item) => item._id.toString() === req.params.addressId);
  res.json({
    success: true,
    message: 'Default address set successfully',
    data: { address },
  });
});

export default {
  getMe,
  updateProfile,
  uploadAvatar,
  changePassword,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
