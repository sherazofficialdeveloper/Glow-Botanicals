// backend/src/config/index.js
import dotenv from 'dotenv';
import connectDB from './database.js';
import jwtConfig from './jwt.js';
import passport from './passport.js';
import upload from './multer.js';
import * as email from './email.js';
import payment from './payment.js';
import corsOptions from './cors.js';
import { generalLimiter, authLimiter, adminLimiter, apiLimiter, strictLimiter } from './rateLimit.js';
import { getRedisClient, setCache, getCache, deleteCache } from './redis.js';

dotenv.config();

export const config = {
  database: connectDB,
  jwt: jwtConfig,
  passport,
  multer: upload,
  email,
  payment,
  cors: corsOptions,
  rateLimit: {
    general: generalLimiter,
    auth: authLimiter,
    admin: adminLimiter,
    api: apiLimiter,
    strict: strictLimiter,
  },
  redis: {
    getClient: getRedisClient,
    setCache,
    getCache,
    deleteCache,
  },
  env: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
  },
};

export default config;