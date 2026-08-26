// backend/src/controllers/adminController.js
import catchAsync from '../utils/catchAsync.js';
import * as adminService from '../services/adminService.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const data = await adminService.getDashboardStats();
  res.json({ success: true, data });
});

export const getUsers = catchAsync(async (req, res) => {
  const data = await adminService.getUsers(req.query);
  res.json({ success: true, data });
});

export const getUserById = catchAsync(async (req, res) => {
  const data = await adminService.getUserById(req.params.id);
  res.json({ success: true, data });
});

// NOTE: no updateUserRole controller — role changes are database-only
// by explicit product requirement (see routes/adminRoutes.js).

export const toggleUserActive = catchAsync(async (req, res) => {
  const user = await adminService.toggleUserActive(req.params.id, req.user);
  res.json({
    success: true,
    message: 'User status updated successfully',
    data: { user },
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUser(req.params.id, req.user);
  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const getOrders = catchAsync(async (req, res) => {
  const data = await adminService.getOrders(req.query);
  res.json({ success: true, data });
});

export const getOrderById = catchAsync(async (req, res) => {
  const order = await adminService.getOrderById(req.params.id);
  res.json({
    success: true,
    data: { order },
  });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await adminService.updateOrderStatus(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order },
  });
});

export const deleteOrder = catchAsync(async (req, res) => {
  await adminService.deleteOrder(req.params.id);
  res.json({
    success: true,
    message: 'Order deleted successfully',
  });
});

export const getProducts = catchAsync(async (req, res) => {
  const data = await adminService.getProducts(req.query);
  res.json({ success: true, data });
});

export const getProductById = catchAsync(async (req, res) => {
  const product = await adminService.getProductById(req.params.id);
  res.json({
    success: true,
    data: { product },
  });
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await adminService.createProduct(req.body);
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await adminService.updateProduct(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  await adminService.deleteProduct(req.params.id);
  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

export const getSettings = catchAsync(async (req, res) => {
  const settings = await adminService.getSettings();
  res.json({
    success: true,
    data: { settings },
  });
});

export const updateSettings = catchAsync(async (req, res) => {
  const settings = await adminService.updateSettings(req.body);
  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: { settings },
  });
});

export default {
  getDashboardStats,
  getUsers,
  getUserById,
  toggleUserActive,
  deleteUser,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSettings,
  updateSettings,
};