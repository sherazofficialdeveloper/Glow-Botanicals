export class PaymentProviderError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = 'PaymentProviderError';
    this.statusCode = statusCode;
  }
}

export const notImplementedProvider = (method) => ({
  method,
  enabled: false,
  async createPayment() {
    throw new PaymentProviderError(`${method} is not configured yet`, 501);
  },
  async capturePayment() {
    throw new PaymentProviderError(`${method} is not configured yet`, 501);
  },
  async refundPayment() {
    throw new PaymentProviderError(`${method} refunds are not configured yet`, 501);
  },
  async handleWebhook() {
    return { received: true, ignored: true };
  },
  getPublicConfig() {
    return { method, enabled: false };
  },
});
