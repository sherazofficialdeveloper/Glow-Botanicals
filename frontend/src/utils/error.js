// frontend/src/utils/error.js

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isAppError = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Something went wrong. Please try again.';
};

export const getErrorStatus = (error) => {
  if (!error) return 500;
  return error.response?.status || error.statusCode || 500;
};

export const getErrorCode = (error) => {
  if (!error) return 'UNKNOWN_ERROR';
  return error.response?.data?.code || error.code || 'UNKNOWN_ERROR';
};

export const isAuthError = (error) => {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
};

export const isNetworkError = (error) => {
  return !error.response || error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR';
};

export const handleError = (error, fallbackMessage = 'Something went wrong') => {
  const message = getErrorMessage(error);
  const status = getErrorStatus(error);
  
  // Log error
  console.error('[Error]', { message, status, error });
  
  // Return user-friendly message
  if (status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return message || fallbackMessage;
};

export default {
  AppError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ConflictError,
  NetworkError,
  getErrorMessage,
  getErrorStatus,
  getErrorCode,
  isAuthError,
  isNetworkError,
  handleError,
};