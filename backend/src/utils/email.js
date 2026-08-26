// backend/src/utils/email.js

import nodemailer from 'nodemailer';
import logger from './logger.js';
import { getEmailConfig } from '../config/email.js';

const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const config = getEmailConfig();
  const transporter = createTransporter();
  await transporter.verify();

  const info = await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  });

  logger.info(`Email sent to ${to}: ${subject}`);
  return info;
};

export default { sendEmail };
