// backend/src/utils/emailTemplates.js

const brandColor = '#E2712E';
const year = () => new Date().getFullYear();

const wrap = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background: #f5f5f5; font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 30px auto; padding: 20px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
    .header { background: ${brandColor}; color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 30px 25px; }
    .otp-box { margin: 25px 0; padding: 20px; text-align: center; border: 2px dashed ${brandColor}; border-radius: 10px; background: #fffaf7; }
    .otp { margin: 10px 0 0; font-size: 34px; font-weight: bold; letter-spacing: 6px; color: ${brandColor}; }
    .button { display: inline-block; background: ${brandColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
    .footer { padding: 20px; text-align: center; color: #777; font-size: 12px; background: #fafafa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header"><h1>${title}</h1></div>
      <div class="content">${bodyHtml}</div>
      <div class="footer">© ${year()} Glow Botanical. All rights reserved.</div>
    </div>
  </div>
</body>
</html>
`;

export const passwordResetOtpTemplate = (user, otp) => ({
  subject: 'Password Reset OTP',
  html: wrap(
    'Password Reset',
    `
      <h2>Hi ${user.name},</h2>
      <p>You requested to reset your password. Use the OTP below to continue.</p>
      <div class="otp-box">
        <div>Your OTP code is:</div>
        <div class="otp">${otp}</div>
      </div>
      <p>This OTP will expire in <strong>10 minutes</strong>.</p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>— The Glow BotanicalTeam</p>
    `
  ),
});

export const welcomeEmailTemplate = (user) => ({
  subject: 'Welcome to CutiesGlow! ✨',
  html: wrap(
    '✨ Welcome to CutiesGlow!',
    `
      <h2>Hi ${user.name},</h2>
      <p>Thank you for joining the Glow Botanicalfamily!</p>
      <p>Use code <strong>WELCOME10</strong> to get 10% off your first order.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Shopping</a>
      </p>
      <p>— The Glow BotanicalTeam</p>
    `
  ),
});

export const orderConfirmationTemplate = (order, user) => ({
  subject: `Order confirmation #${order.orderNumber || order._id}`,
  html: wrap(
    'Order Confirmed',
    `
      <h2>Hi ${user?.name || order.customerName},</h2>
      <p>Thank you for your order. We will update you when it ships.</p>
      <p><strong>Order:</strong> ${order.orderNumber || order._id}</p>
      <p><strong>Total:</strong> $${Number(order.total || 0).toFixed(2)}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <p>— The Glow BotanicalTeam</p>
    `
  ),
});

export const paymentVerifiedTemplate = (order, user) => ({
  subject: `Payment received for order #${order.orderNumber || order._id}`,
  html: wrap(
    'Payment Verified',
    `
      <h2>Hi ${user?.name || order.customerName},</h2>
      <p>Your payment has been verified and your order is now being processed.</p>
      <p><strong>Order:</strong> ${order.orderNumber || order._id}</p>
      <p><strong>Total:</strong> $${Number(order.total || 0).toFixed(2)}</p>
      <p>— The Glow BotanicalTeam</p>
    `
  ),
});

export const passwordResetLinkTemplate = (user, resetUrl) => ({
  subject: 'Reset your Glow Botanicalpassword',
  html: wrap(
    'Password Reset',
    `
      <h2>Hi ${user.name},</h2>
      <p>Click the button below to reset your password.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </p>
      <p>If you did not request this, you can ignore this email.</p>
    `
  ),
});

export const loginNotificationTemplate = (user) => ({
  subject: 'New Login to Your Account',
  html: wrap(
    'New Login',
    `
      <h2>Hi ${user.name || 'there'},</h2>
      <p>A new login to your account was successful on ${new Date().toLocaleString()}.</p>
      <p>If this was not you, please secure your account immediately.</p>
      <p>— The Glow Botanical Team</p>
    `
  ),
});

export const favoriteAddedTemplate = (user, product) => ({
  subject: 'Item Added to Your Favorites',
  html: wrap(
    'Added to Favorites',
    `
      <h2>Hi ${user.name || 'there'},</h2>
      <p><strong>${product.name}</strong> was added to your favorites.</p>
      <p>— The Glow Botanical Team</p>
    `
  ),
});

export const orderCompletedTemplate = (order, user) => ({
  subject: `Your Order Has Been Completed #${order.orderNumber || order._id}`,
  html: wrap(
    'Order Completed',
    `
      <h2>Hi ${user?.name || order.customerName || 'there'},</h2>
      <p>Your order has been completed.</p>
      <p><strong>Order:</strong> ${order.orderNumber || order._id}</p>
      <p><strong>Total:</strong> $${Number(order.total || 0).toFixed(2)}</p>
      <p>— The Glow Botanical Team</p>
    `
  ),
});