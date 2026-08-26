// backend/src/controllers/paymentController.js
import catchAsync from '../utils/catchAsync.js';
import * as paymentService from '../services/paymentService.js';

export const listPaymentMethods = catchAsync(async (req, res) => {
  res.json({
    success: true,
    data: { methods: paymentService.getPublicPaymentMethods() },
  });
});

export const createPayPalOrder = catchAsync(async (req, res) => {
  const result = await paymentService.createProviderPayment({
    method: 'paypal',
    orderId: req.body.orderId,
    user: req.user,
  });

  res.json({
    success: true,
    data: {
      orderId: result.providerOrderId,
      approvalUrl: result.approvalUrl,
      status: result.status,
    },
  });
});

export const capturePayPalOrder = catchAsync(async (req, res) => {
  const result = await paymentService.captureProviderPayment({
    orderId: req.params.orderId,
    user: req.user,
    providerOrderId: req.body.providerOrderId,
  });

  res.json({
    success: true,
    message: 'Payment captured successfully',
    data: { order: result.order },
  });
});

export const createStripePaymentIntent = catchAsync(async (req, res) => {
  const result = await paymentService.createProviderPayment({
    method: 'stripe',
    orderId: req.body.orderId,
    user: req.user,
  });

  res.json({
    success: true,
    data: {
      clientSecret: result.clientSecret,
      status: result.status,
    },
  });
});

export const captureStripePayment = catchAsync(async (req, res) => {
  const result = await paymentService.captureProviderPayment({
    orderId: req.params.orderId,
    user: req.user,
    providerOrderId: req.body.providerOrderId,
  });

  res.json({
    success: true,
    message: 'Payment captured successfully',
    data: { order: result.order },
  });
});

export const handleWebhook = catchAsync(async (req, res) => {
  const result = await paymentService.handleProviderWebhook(
    req.params.provider,
    req.body,
    req.headers
  );

  res.json({
    success: true,
    data: result,
  });
});

export default {
  listPaymentMethods,
  createPayPalOrder,
  capturePayPalOrder,
  createStripePaymentIntent,
  captureStripePayment,
  handleWebhook,
};
