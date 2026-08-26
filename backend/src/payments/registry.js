import { AppError } from '../utils/error.js';
import paypalProvider from './providers/paypal.js';
import stripeProvider from './providers/stripe.js';
import codProvider from './providers/cod.js';
import afterpayProvider from './providers/afterpay.js';
import klarnaProvider from './providers/klarna.js';

const providers = new Map();

export const registerPaymentProvider = (provider) => {
  if (!provider?.method) {
    throw new Error('Payment provider must define a method');
  }
  providers.set(provider.method, provider);
};

export const getPaymentProvider = (method) => {
  const provider = providers.get(method);
  if (!provider) {
    throw new AppError(`Unsupported payment method: ${method}`, 400);
  }
  return provider;
};

export const listPaymentProviders = () => {
  return Array.from(providers.values()).map((provider) => provider.getPublicConfig());
};

registerPaymentProvider(paypalProvider);
registerPaymentProvider(stripeProvider);
registerPaymentProvider(codProvider);
registerPaymentProvider(afterpayProvider);
registerPaymentProvider(klarnaProvider);

export default {
  registerPaymentProvider,
  getPaymentProvider,
  listPaymentProviders,
};
