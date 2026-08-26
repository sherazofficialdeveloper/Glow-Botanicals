// backend/src/utils/errorUtils.js

/**
 * Format an error into a consistent API response object.
 *
 * @param {Error} error
 * @param {Object} options
 * @returns {Object}
 */
export const formatError = (
  error,
  options = {}
) => {
  const {
    includeStack = false,
    includeCode = true,
  } = options;

  const result = {
    message:
      error?.message ||
      'An unexpected error occurred',
  };

  if (
    includeCode &&
    error?.code
  ) {
    result.code = error.code;
  }

  if (
    error?.statusCode
  ) {
    result.statusCode =
      error.statusCode;
  }

  if (
    error?.errors
  ) {
    result.errors =
      error.errors;
  }

  if (
    includeStack &&
    error?.stack
  ) {
    result.stack =
      error.stack;
  }

  return result;
};

/**
 * Check whether an error is an application error.
 *
 * @param {Error} error
 * @returns {boolean}
 */
export const isAppError = (error) => {
  return (
    error?.isAppError === true
  );
};

/**
 * Check whether an error is a validation error.
 *
 * Supports both our custom ValidationError
 * and errors identified by the validation status code.
 *
 * @param {Error} error
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return (
    error?.name === 'ValidationError' ||
    error?.code === 'VALIDATION_ERROR'
  );
};

/**
 * Check whether an error is a MongoDB duplicate-key error.
 *
 * MongoDB duplicate key errors use code 11000.
 *
 * @param {Error} error
 * @returns {boolean}
 */
export const isDuplicateKeyError = (
  error
) => {
  return error?.code === 11000;
};

export default {
  formatError,
  isAppError,
  isValidationError,
  isDuplicateKeyError,
};