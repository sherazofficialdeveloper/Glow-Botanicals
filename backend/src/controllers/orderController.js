// backend/src/controllers/orderController.js
import catchAsync from '../utils/catchAsync.js';
import * as orderService from '../services/orderService.js';

export const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order },
  });
});

export const getOrders = catchAsync(async (req, res) => {
  const result = await orderService.getOrders(req.user, req.query);
  res.json({
    success: true,
    data: result,
  });
});

export const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);
  res.json({
    success: true,
    data: { order },
  });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.user);
  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order },
  });
});

export const cancelOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user);
  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order },
  });
});

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
};