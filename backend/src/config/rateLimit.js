// backend/src/config/rateLimit.js
import rateLimit from 'express-rate-limit';

// General rate limiter - 1000 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiter - 50 requests per 15 minutes (increased from 10)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // ✅ Increased from 10 to 50
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // ✅ Don't count successful logins
});

// Admin rate limiter - 500 requests per hour
export const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiter - 200 requests per minute
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: {
    success: false,
    message: 'Too many requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter - 20 requests per minute (increased from 5)
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // ✅ Increased from 5 to 20
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  generalLimiter,
  authLimiter,
  adminLimiter,
  apiLimiter,
  strictLimiter,
};