import Stripe from 'stripe';
import { stripeConfig } from '../../config/payment.js';
import { AppError } from '../../utils/error.js';

const getClient = () => {
  if (!stripeConfig.secretKey) {
    throw new AppError('Stripe is not configured', 503);
  }
  return new Stripe(stripeConfig.secretKey);
};

const stripeProvider = {
  method: 'stripe',
  enabled: Boolean(stripeConfig.secretKey),

  async createPayment({ amount, currency = 'usd', metadata = {} }) {
    const stripe = getClient();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return {
      providerOrderId: intent.id,
      status: intent.status,
      clientSecret: intent.client_secret,
    };
  },

  async capturePayment({ providerOrderId }) {
    const stripe = getClient();
    const intent = await stripe.paymentIntents.retrieve(providerOrderId);
    return {
      providerOrderId: intent.id,
      status: intent.status,
      capturedAmount: intent.amount_received ? intent.amount_received / 100 : 0,
    };
  },

  async refundPayment({ providerOrderId, amount }) {
    const stripe = getClient();
    const refund = await stripe.refunds.create({
      payment_intent: providerOrderId,
      ...(amount ? { amount: Math.round(Number(amount) * 100) } : {}),
    });
    return {
      refundId: refund.id,
      status: refund.status,
    };
  },

  async handleWebhook(rawBody, headers) {
    if (!stripeConfig.webhookSecret) {
      throw new AppError('Stripe webhook secret is not configured', 503);
    }
    const stripe = getClient();
    const signature = headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(rawBody, signature, stripeConfig.webhookSecret);
    return { received: true, type: event.type, data: event.data.object };
  },

  getPublicConfig() {
    return {
      method: 'stripe',
      enabled: this.enabled,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    };
  },
};

export default stripeProvider;
