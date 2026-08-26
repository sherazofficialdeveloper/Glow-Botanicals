// frontend/src/services/paymentService.js
import { api } from './api';

export const paymentService = {
  // ============================================================
  // PAYMENT METHODS
  // ============================================================

  // Get available payment methods
  async getPaymentMethods() {
    const response = await api.get('/payments/methods');
    return response.data.data.methods;
  },

  // ============================================================
  // PAYPAL
  // ============================================================

  // Create PayPal order
  async createPayPalOrder(orderId) {
    const response = await api.post('/payments/paypal/create', { orderId });
    return response.data.data;
  },

  // Capture PayPal order
  async capturePayPalOrder(orderId, providerOrderId) {
    const response = await api.post(`/payments/paypal/capture/${orderId}`, { providerOrderId });
    return response.data.data;
  },

  // ============================================================
  // STRIPE (also covers Klarna/Afterpay when enabled via Stripe's
  // PaymentElement automatic_payment_methods — see StripePayment.jsx)
  // ============================================================

  // Create PaymentIntent (returns a client secret for Stripe Elements)
  async createStripePaymentIntent(orderId) {
    const response = await api.post('/payments/stripe/create-intent', { orderId });
    return response.data.data;
  },

  // Confirm/capture on the backend after Stripe.js confirms client-side
  // (backend re-queries Stripe directly — never trusts the client alone)
  async captureStripePayment(orderId) {
    const response = await api.post(`/payments/stripe/capture/${orderId}`, {});
    return response.data.data;
  },
};

export default paymentService;
