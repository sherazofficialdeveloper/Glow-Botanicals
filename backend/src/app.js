// backend/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';

import connectDB from './config/database.js';
import corsOptions from './config/cors.js';
import { generalLimiter, authLimiter } from './config/rateLimit.js'; // ✅ Import authLimiter
import errorHandler from './middleware/errorHandler.js';
import { xssProtection, sanitizeRequestBody } from './middleware/sanitize.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// ============================================================
// DATABASE CONNECTION
// ============================================================

connectDB();

// ============================================================
// MIDDLEWARE
// ============================================================

// Security
app.use(helmet());
app.use(cors(corsOptions));
app.use(xssProtection);
app.use(sanitizeRequestBody);

// Compression
app.use(compression());

// Body Parsing
//
// IMPORTANT: Stripe webhook signature verification requires the exact
// raw request body bytes. We register a raw-body parser for that one
// path BEFORE the global JSON parser, and make the JSON parser skip it
// so it doesn't consume/overwrite the raw buffer.
const STRIPE_WEBHOOK_PATH = '/api/payments/webhook/stripe';

app.use(STRIPE_WEBHOOK_PATH, express.raw({ type: 'application/json', limit: '10mb' }));

app.use((req, res, next) => {
  if (req.originalUrl === STRIPE_WEBHOOK_PATH) {
    return next();
  }
  return express.json({ limit: '10mb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================================
// ✅ RATE LIMITING - FIXED
// ============================================================

// Apply general rate limiter to all API routes
app.use('/api', (req, res, next) => {
  // Skip rate limiting for auth routes (they have their own authLimiter)
  if (req.path.startsWith('/auth')) {
    return next();
  }
  return generalLimiter(req, res, next);
});

// Apply auth rate limiter to auth routes
app.use('/api/auth', authLimiter);

// Passport
app.use(passport.initialize());

// ============================================================
// ROUTES
// ============================================================

app.use('/api', routes);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================================
// ERROR HANDLING
// ============================================================

app.use(errorHandler);

export default app;