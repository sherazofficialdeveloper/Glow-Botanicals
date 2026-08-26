const codProvider = {
  method: 'cod',
  enabled: true,

  async createPayment({ order }) {
    return {
      providerOrderId: order._id.toString(),
      status: 'pending',
    };
  },

  async capturePayment() {
    return { status: 'pending' };
  },

  async refundPayment() {
    return { status: 'manual' };
  },

  async handleWebhook() {
    return { received: true, ignored: true };
  },

  getPublicConfig() {
    return { method: 'cod', enabled: true };
  },
};

export default codProvider;
