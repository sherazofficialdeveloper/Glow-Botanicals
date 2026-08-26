// backend/src/middleware/index.js
import auth from './auth.js';
import admin from './admin.js';
import validate, { commonValidations } from './validate.js';
import upload, { uploadSingle, uploadMultiple } from './upload.js';
import errorHandler from './errorHandler.js';
import { 
  generalLimiter, 
  authLimiter, 
  adminLimiter, 
  apiLimiter, 
  strictLimiter 
} from './rateLimiter.js';
import loggerMiddleware, { httpLogger, devLogger, prodLogger } from './logger.js';
import corsMiddleware from './cors.js';
import { 
  sanitizeBody, 
  sanitizeQuery, 
  sanitizations, 
  sanitizeRequestBody, 
  xssProtection 
} from './sanitize.js';

export {
  auth,
  admin,
  validate,
  commonValidations,
  upload,
  uploadSingle,
  uploadMultiple,
  errorHandler,
  generalLimiter,
  authLimiter,
  adminLimiter,
  apiLimiter,
  strictLimiter,
  loggerMiddleware,
  httpLogger,
  devLogger,
  prodLogger,
  corsMiddleware,
  sanitizeBody,
  sanitizeQuery,
  sanitizations,
  sanitizeRequestBody,
  xssProtection,
};

export default {
  auth,
  admin,
  validate,
  commonValidations,
  upload,
  uploadSingle,
  uploadMultiple,
  errorHandler,
  generalLimiter,
  authLimiter,
  adminLimiter,
  apiLimiter,
  strictLimiter,
  loggerMiddleware,
  httpLogger,
  devLogger,
  prodLogger,
  corsMiddleware,
  sanitizeBody,
  sanitizeQuery,
  sanitizations,
  sanitizeRequestBody,
  xssProtection,
};