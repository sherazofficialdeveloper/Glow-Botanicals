// backend/src/services/paymentService.js

import Order from '../models/Order.js';
import { AppError } from '../utils/error.js';
import logger from '../utils/logger.js';
import { getPaymentProvider, listPaymentProviders } from '../payments/index.js';

const getOrderForUser = async (orderId, user) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const userId = user?.id || user?._id;
  const isOwner = order.userId && userId && order.userId.toString() === userId.toString();
  const isAdmin = user?.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('Unauthorized to access this order', 403);
  }

  return order;
};

export const getPublicPaymentMethods = () => listPaymentProviders();

export const getProviderPublicConfig = (method) => {
  return getPaymentProvider(method).getPublicConfig();
};

export const createProviderPayment = async ({ method, orderId, user }) => {
  const order = await getOrderForUser(orderId, user);
  const provider = getPaymentProvider(method || order.paymentMethod);

  const result = await provider.createPayment({
    order,
    amount: order.total,
    currency: 'USD',
    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    },
  });

  order.paymentProviderOrderId = result.providerOrderId || order.paymentProviderOrderId;
  order.paymentStatus = result.status || order.paymentStatus || 'pending';
  await order.save();

  return {
    order,
    ...result,
  };
};

export const captureProviderPayment = async ({ orderId, user, providerOrderId }) => {
  const order = await getOrderForUser(orderId, user);
  const provider = getPaymentProvider(order.paymentMethod);
  const captureId = providerOrderId || order.paymentProviderOrderId;

  if (!captureId) {
    throw new AppError('No provider payment to capture', 400);
  }

  const result = await provider.capturePayment({
    providerOrderId: captureId,
    order,
  });

  const captured = ['COMPLETED', 'succeeded', 'captured', 'paid'].includes(
    String(result.status || '')
  );

  if (captured) {
    order.status = 'paid';
    order.paymentStatus = 'captured';
    await order.save();
  }

  return { order, ...result };
};

export const handleProviderWebhook = async (method, rawBody, headers) => {
  const provider = getPaymentProvider(method);
  const result = await provider.handleWebhook(rawBody, headers);

  if (method === 'stripe' && result?.type && result?.data) {
    await syncOrderFromStripeEvent(result.type, result.data);
  }

  return result;
};

// Server-authoritative order sync from a verified Stripe webhook event.
// Never trust the frontend alone for payment status — this is the
// backstop that reconciles order state even if the client-side confirm
// call never completes (closed tab, network drop, etc).
const syncOrderFromStripeEvent = async (eventType, paymentIntent) => {
  if (!paymentIntent?.id) return;

  const order = await Order.findOne({
    paymentProviderOrderId: paymentIntent.id,
    paymentMethod: 'stripe',
  });

  if (!order) {
    logger.warn(`Stripe webhook: no matching order for PaymentIntent ${paymentIntent.id}`);
    return;
  }

  // Idempotency guard: don't reprocess an already-captured order, and
  // don't downgrade a captured order on a late/duplicate failure event.
  if (order.paymentStatus === 'captured') return;

  if (eventType === 'payment_intent.succeeded') {
    order.status = 'paid';
    order.paymentStatus = 'captured';
    await order.save();
  } else if (eventType === 'payment_intent.payment_failed') {
    order.paymentStatus = 'failed';
    await order.save();
  }
};

export default {
  getPublicPaymentMethods,
  getProviderPublicConfig,
  createProviderPayment,
  captureProviderPayment,
  handleProviderWebhook,
};
