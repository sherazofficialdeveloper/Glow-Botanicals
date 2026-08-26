// frontend/src/services/couponService.js
import { api } from './api';

export const couponService = {
  // Validate a coupon code against the current subtotal
  async validateCoupon(code) {
    const response = await api.get(`/coupons/validate/${encodeURIComponent(code)}`);
    return response.data.data;
  },
};

export default couponService;
