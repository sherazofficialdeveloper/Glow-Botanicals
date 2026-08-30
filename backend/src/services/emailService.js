// backend/src/services/emailService.js

import { sendEmail } from '../utils/email.js';
import logger from '../utils/logger.js';
import {
  passwordResetOtpTemplate,
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  passwordResetLinkTemplate,
  loginNotificationTemplate,
  favoriteAddedTemplate,
  orderCompletedTemplate,
} from '../utils/emailTemplates.js';

const sendSafely = async (payload) => {
  try {
    return await sendEmail(payload);
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
};

const sendInBackground = (eventName, send) => {
  setImmediate(() => {
    send().catch((error) => {
      logger.error(`${eventName} email failed: ${error.message}`);
    });
  });
};
export const sendOTPEmail = async (user, otp) => {
  const template = passwordResetOtpTemplate(user, otp);
  return sendSafely({
    to: user.email,
    ...template,
  });
};

export const sendWelcomeEmail = async (user) => {
  const template = welcomeEmailTemplate(user);
  return sendSafely({
    to: user.email,
    ...template,
  });
};

export const sendOrderConfirmation = async (order, user) => {
  const template = orderConfirmationTemplate(order, user);
  return sendSafely({
    to: user?.email || order.customerEmail,
    ...template,
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const template = passwordResetLinkTemplate(user, resetUrl);
  return sendSafely({
    to: user.email,
    ...template,
  });
};

export default {
  sendOTPEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail,
};
export const sendWelcomeEmailInBackground = (user) =>
  sendInBackground('Welcome', () => sendWelcomeEmail(user));

export const sendLoginNotificationInBackground = (user) =>
  sendInBackground('Login notification', async () => {
    const template = loginNotificationTemplate(user);
    return sendSafely({ to: user.email, ...template });
  });

export const sendFavoriteAddedInBackground = (user, product) =>
  sendInBackground('Favorite notification', async () => {
    const template = favoriteAddedTemplate(user, product);
    return sendSafely({ to: user.email, ...template });
  });

export const sendOrderConfirmationInBackground = (order, user) =>
  sendInBackground('Order confirmation', () => sendOrderConfirmation(order, user));

export const sendOrderCompletedInBackground = (order, user) =>
  sendInBackground('Order completion', async () => {
    const template = orderCompletedTemplate(order, user);
    return sendSafely({ to: user?.email || order.customerEmail, ...template });
  });
