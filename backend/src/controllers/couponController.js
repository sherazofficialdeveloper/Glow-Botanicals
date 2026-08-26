// backend/src/controllers/couponController.js

import catchAsync from '../utils/catchAsync.js';
import * as couponService from '../services/couponService.js';

export const validateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.validateCouponCode(req.params.code);
  res.json({
    success: true,
    message: 'Coupon is valid',
    data: {
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
      },
    },
  });
});

export const getCoupons = catchAsync(async (req, res) => {
  const coupons = await couponService.getCoupons();
  res.json({
    success: true,
    data: {
      items: coupons,
      total: coupons.length,
    },
  });
});

export const getCouponById = catchAsync(async (req, res) => {
  const coupon = await couponService.getCouponById(req.params.id);
  res.json({
    success: true,
    data: { coupon },
  });
});

export const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: { coupon },
  });
});

export const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Coupon updated successfully',
    data: { coupon },
  });
});

export const deleteCoupon = catchAsync(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  res.json({
    success: true,
    message: 'Coupon deleted successfully',
  });
});

export default {
  validateCoupon,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
