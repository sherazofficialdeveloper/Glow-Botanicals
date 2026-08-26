import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js';
import { AppError } from '../utils/error.js';

const normalizeCouponPayload = (data = {}) => ({
  code: data.code,
  type: data.type || data.discountType,
  value: data.value ?? data.discountValue,
  minPurchase: data.minPurchase ?? data.minimumOrderAmount,
  maxDiscount: data.maxDiscount ?? data.maximumDiscount,
  maxUses: data.maxUses ?? data.usageLimit,
  expiresAt: data.expiresAt ?? data.expiryDate,
  isActive: data.isActive,
});

export const getCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 });
};

export const getCouponById = async (couponId) => {
  if (!mongoose.Types.ObjectId.isValid(couponId)) {
    throw new AppError('Invalid coupon ID', 400);
  }

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }
  return coupon;
};

export const validateCouponCode = async (code) => {
  const coupon = await Coupon.findOne({
    code: String(code || '').toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new AppError('Invalid coupon code', 404);
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new AppError('Coupon has expired', 400);
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  return coupon;
};

export const createCoupon = async (data) => {
  const payload = normalizeCouponPayload(data);

  if (!payload.code?.trim()) {
    throw new AppError('Coupon code is required', 400);
  }

  if (!['percentage', 'fixed'].includes(payload.type)) {
    throw new AppError('Invalid coupon type', 400);
  }

  const value = Number(payload.value);
  if (!Number.isFinite(value) || value <= 0) {
    throw new AppError('Discount value must be greater than 0', 400);
  }

  if (payload.type === 'percentage' && value > 100) {
    throw new AppError('Percentage discount cannot exceed 100%', 400);
  }

  const normalizedCode = payload.code.trim().toUpperCase();
  const existing = await Coupon.findOne({ code: normalizedCode });
  if (existing) {
    throw new AppError('Coupon code already exists', 409);
  }

  return Coupon.create({
    code: normalizedCode,
    type: payload.type,
    value,
    minPurchase: Number(payload.minPurchase) || 0,
    maxDiscount: payload.maxDiscount != null ? Number(payload.maxDiscount) : null,
    maxUses: payload.maxUses != null ? Number(payload.maxUses) : null,
    expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    isActive: payload.isActive !== undefined ? payload.isActive : true,
  });
};

export const updateCoupon = async (couponId, data) => {
  const coupon = await getCouponById(couponId);
  const payload = normalizeCouponPayload(data);

  if (payload.code !== undefined) {
    const code = payload.code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code, _id: { $ne: couponId } });
    if (existing) {
      throw new AppError('Coupon code already exists', 409);
    }
    coupon.code = code;
  }

  if (payload.type !== undefined) coupon.type = payload.type;
  if (payload.value !== undefined) coupon.value = Number(payload.value);
  if (payload.minPurchase !== undefined) coupon.minPurchase = Number(payload.minPurchase);
  if (payload.maxDiscount !== undefined) {
    coupon.maxDiscount = payload.maxDiscount ? Number(payload.maxDiscount) : null;
  }
  if (payload.maxUses !== undefined) {
    coupon.maxUses = payload.maxUses ? Number(payload.maxUses) : null;
  }
  if (payload.expiresAt !== undefined) coupon.expiresAt = new Date(payload.expiresAt);
  if (payload.isActive !== undefined) coupon.isActive = payload.isActive;

  if (coupon.type === 'percentage' && Number(coupon.value) > 100) {
    throw new AppError('Percentage discount cannot exceed 100%', 400);
  }

  await coupon.save();
  return coupon;
};

export const deleteCoupon = async (couponId) => {
  const coupon = await getCouponById(couponId);
  await coupon.deleteOne();
  return true;
};

export default {
  getCoupons,
  getCouponById,
  validateCouponCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
