// backend/src/services/emailService.js

import { sendEmail } from '../utils/email.js';
import logger from '../utils/logger.js';
import {
  passwordResetOtpTemplate,
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  passwordResetLinkTemplate,
} from '../utils/emailTemplates.js';

const sendSafely = async (payload) => {
  try {
    return await sendEmail(payload);
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
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
