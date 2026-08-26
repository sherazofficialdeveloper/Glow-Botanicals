// backend/src/middleware/errorHandler.js
import logger from '../utils/logger.js';

const isProduction = () => process.env.NODE_ENV === 'production';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;
  let code = err.code || null;

  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Uploaded file is too large'
      : err.message;
    code = 'UPLOAD_ERROR';
  }

  // ✅ Handle duplicate key error (MongoDB 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
    message = `${field} already exists. Please use a different ${field}.`;
    code = 'DUPLICATE_KEY';
  }

  // ✅ Handle validation errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation failed';
    if (typeof err.errors === 'object' && !Array.isArray(err.errors)) {
      errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
    }
    code = 'VALIDATION_ERROR';
  }

  // ✅ Handle express-validator errors
  if (err.name === 'ValidationError' && Array.isArray(err.errors)) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      field: e.param || e.path,
      message: e.msg,
    }));
    code = 'VALIDATION_ERROR';
  }

  // ✅ Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    code = 'AUTH_ERROR';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
    code = 'AUTH_ERROR';
  }

  // ✅ Handle cast errors (invalid ID)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  }

  // ✅ Handle app errors
  if (err.isAppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  }

  // ✅ Production: Don't expose internal errors
  if (isProduction() && statusCode >= 500 && !err.isAppError) {
    message = 'Internal server error';
    errors = null;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(code && { code }),
    ...(errors && { errors }),
    ...(!isProduction() && { stack: err.stack }),
  });
};

export default errorHandler;
