// backend/src/services/orderService.js

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';
import { AppError } from '../utils/error.js';
import logger from '../utils/logger.js';
import { sendOrderConfirmation } from './emailService.js';
import { isValidPaymentMethod } from '../config/payment.js';

const assertOrderAccess = (order, user, { adminOnly = false } = {}) => {
  const userId = user?.id || user?._id;
  const isAdmin = user?.role === 'admin';
  const isOwner = order.userId && userId && order.userId.toString() === userId.toString();

  if (adminOnly && !isAdmin) {
    throw new AppError('Admin access required', 403);
  }

  if (!isOwner && !isAdmin) {
    throw new AppError('Unauthorized to access this order', 403);
  }
};

const applyCoupon = async (couponCode, subtotal) => {
  if (!couponCode) {
    return { discount: 0, coupon: null };
  }

  const coupon = await Coupon.findOne({
    code: String(couponCode).toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new AppError('Invalid coupon code', 400);
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new AppError('Coupon has expired', 400);
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    throw new AppError(`Minimum purchase of ${coupon.minPurchase} required for this coupon`, 400);
  }

  let discount =
    coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  discount = Math.min(discount, subtotal);
  return { discount, coupon };
};

export const createOrder = async (orderData, user) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    couponCode,
    notes,
    email,
    name,
    phone,
  } = orderData;

  if (!isValidPaymentMethod(paymentMethod)) {
    throw new AppError('Invalid payment method', 400);
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.id || item.productId);
    if (!product) {
      throw new AppError(`Product ${item.id || item.productId} not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    subtotal += product.price * item.quantity;
    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images?.[0] || '',
    });
  }

  const { discount, coupon } = await applyCoupon(couponCode, subtotal);
  const settings = await Settings.findOne().select(
    'freeShippingThreshold standardShippingCost taxRate'
  );

  const freeShippingThreshold = settings?.freeShippingThreshold ?? 35;
  const standardShippingCost = settings?.standardShippingCost ?? 5.99;
  const taxRate = (settings?.taxRate ?? 8) / 100;

  const shipping = subtotal > freeShippingThreshold ? 0 : standardShippingCost;
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + shipping + tax;

  const order = await Order.create({
    userId: user?.id || user?._id || null,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    coupon: coupon?._id,
    notes,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    status: 'pending',
    paymentStatus: 'pending',
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  try {
    await sendOrderConfirmation(order, user || { name, email });
  } catch (emailError) {
    logger.error(`Order confirmation email failed: ${emailError.message}`);
  }

  return order;
};

export const getOrders = async (user, filters = {}) => {
  const { page = 1, limit = 10, status } = filters;
  const skip = (page - 1) * limit;
  const filter = {};

  const isAdmin = user?.role === 'admin';
  if (!isAdmin) {
    filter.userId = user.id || user._id;
  }
  if (status) filter.status = status;

  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('items.productId', 'name images slug'),
    Order.countDocuments(filter),
  ]);

  return {
    items: orders,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10),
  };
};

export const getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId).populate('items.productId', 'name images slug');
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  assertOrderAccess(order, user);
  return order;
};

export const updateOrderStatus = async (orderId, status, user) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  assertOrderAccess(order, user, { adminOnly: true });

  order.status = status;
  await order.save();
  return order;
};

export const cancelOrder = async (orderId, user) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  assertOrderAccess(order, user);

  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled in its current status', 400);
  }

  order.status = 'cancelled';
  order.paymentStatus = order.paymentStatus === 'captured' ? order.paymentStatus : 'failed';
  await order.save();

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }

  return order;
};

export const getAllOrders = async (filters = {}) => {
  const { page = 1, limit = 10, status, search } = filters;
  const skip = (page - 1) * limit;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
      { orderNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('items.productId', 'name images slug')
      .populate('userId', 'name email'),
    Order.countDocuments(filter),
  ]);

  return {
    items: orders,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10),
  };
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};
