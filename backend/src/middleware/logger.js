// backend/src/middleware/logger.js

import morgan from 'morgan';
import logger from '../utils/logger.js';

/**
 * Morgan stream for Winston integration
 */
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

/**
 * Morgan middleware for HTTP request logging
 * Format: :method :url :status :res[content-length] - :response-time ms
 */
export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

/**
 * Simplified logger for development
 */
export const devLogger = morgan('dev');

/**
 * Combined logger for production
 */
export const prodLogger = morgan('combined', { stream });

/**
 * Choose logger based on environment
 */
export const loggerMiddleware = process.env.NODE_ENV === 'development'
  ? devLogger
  : httpLogger;

export default loggerMiddleware;