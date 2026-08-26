// backend/src/utils/error.js

/**
 * Base application error.
 *
 * All expected operational errors in the application
 * should extend this class.
 */
export class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    code = 'UNKNOWN_ERROR',
    data = null
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
    this.isAppError = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error.
 *
 * Used when request data fails business/application validation.
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = {}) {
    super(
      message,
      400,
      'VALIDATION_ERROR',
      null
    );

    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Authentication error.
 *
 * Used when the user is not authenticated.
 */
export class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(
      message,
      401,
      'AUTH_ERROR'
    );

    this.name = 'AuthError';
  }
}

/**
 * Authorization error.
 *
 * Used when an authenticated user does not
 * have permission to perform an action.
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(
      message,
      403,
      'FORBIDDEN'
    );

    this.name = 'ForbiddenError';
  }
}

/**
 * Resource not found error.
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(
      `${resource} not found`,
      404,
      'NOT_FOUND'
    );

    this.name = 'NotFoundError';
  }
}

/**
 * Conflict error.
 *
 * Used for duplicate or conflicting resources.
 */
export class ConflictError extends AppError {
  constructor(
    message = 'Resource already exists'
  ) {
    super(
      message,
      409,
      'CONFLICT'
    );

    this.name = 'ConflictError';
  }
}

/**
 * Default export.
 *
 * Kept for compatibility with existing imports.
 */
export default {
  AppError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};