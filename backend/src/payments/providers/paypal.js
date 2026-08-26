import { paypalConfig } from '../../config/payment.js';
import { AppError } from '../../utils/error.js';
import logger from '../../utils/logger.js';

const paypalRequest = async (path, { method = 'POST', token, body } = {}) => {
  const response = await fetch(`${paypalConfig.apiUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    logger.error(`PayPal API error ${path}: ${response.status}`);
    throw new AppError('PayPal request failed', 502);
  }
  return data;
};

const getAccessToken = async () => {
  if (!paypalConfig.clientId || !paypalConfig.clientSecret) {
    throw new AppError('PayPal is not configured', 503);
  }

  const auth = Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64');
  const response = await fetch(`${paypalConfig.apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new AppError('Failed to authenticate with PayPal', 502);
  }
  return data.access_token;
};

const paypalProvider = {
  method: 'paypal',
  enabled: Boolean(paypalConfig.clientId && paypalConfig.clientSecret),

  async createPayment({ amount, currency = 'USD', metadata = {} }) {
    const accessToken = await getAccessToken();
    const data = await paypalRequest('/v2/checkout/orders', {
      token: accessToken,
      body: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: Number(amount).toFixed(2),
            },
            custom_id: metadata.orderId,
          },
        ],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/checkout/success`,
          cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
        },
      },
    });

    return {
      providerOrderId: data.id,
      status: data.status,
      approvalUrl: data.links?.find((link) => link.rel === 'approve')?.href,
    };
  },

  async capturePayment({ providerOrderId }) {
    const accessToken = await getAccessToken();
    const data = await paypalRequest(`/v2/checkout/orders/${providerOrderId}/capture`, {
      token: accessToken,
      body: {},
    });

    return {
      providerOrderId: data.id,
      status: data.status,
      capturedAmount: data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
    };
  },

  async refundPayment() {
    throw new AppError('PayPal refunds are not implemented yet', 501);
  },

  async handleWebhook() {
    return { received: true, ignored: true };
  },

  getPublicConfig() {
    return {
      method: 'paypal',
      enabled: this.enabled,
      clientId: process.env.PAYPAL_CLIENT_ID || '',
      mode: paypalConfig.mode,
    };
  },
};

export default paypalProvider;
