// backend/src/config/payment.js

export const PAYMENT_METHODS = ['paypal', 'stripe', 'cod', 'afterpay', 'klarna'];

export const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  mode: process.env.PAYPAL_MODE || 'sandbox',
  apiUrl:
    process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com',
};

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
};

export const isValidPaymentMethod = (method) => PAYMENT_METHODS.includes(method);

export default {
  paypal: paypalConfig,
  stripe: stripeConfig,
  isValidPaymentMethod,
  PAYMENT_METHODS,
};
