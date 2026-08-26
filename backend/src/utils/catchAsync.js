// backend/src/utils/catchAsync.js

/**
 * Wrap an async Express handler and forward
 * rejected promises to Express error middleware.
 *
 * @param {Function} handler - Async Express handler
 * @returns {Function} Express middleware
 */
export const catchAsync = (handler) => {
  return (req, res, next) => {
    Promise.resolve(
      handler(req, res, next)
    ).catch(next);
  };
};

export default catchAsync;