// backend/src/middleware/sanitize.js

import { body, query, param } from 'express-validator';

/**
 * Sanitize request body fields
 * @param {Array} fields - Array of field names to sanitize
 * @returns {Array} Express-validator sanitization chains
 */
export const sanitizeBody = (fields) => {
  return fields.map((field) =>
    body(field)
      .trim()
      .escape()
      .stripLow()
  );
};

/**
 * Sanitize query parameters
 * @param {Array} fields - Array of field names to sanitize
 * @returns {Array} Express-validator sanitization chains
 */
export const sanitizeQuery = (fields) => {
  return fields.map((field) =>
    query(field)
      .trim()
      .escape()
      .stripLow()
  );
};

/**
 * Common sanitizations
 */
export const sanitizations = {
  email: (field = 'email') =>
    body(field)
      .normalizeEmail()
      .toLowerCase()
      .trim(),

  name: (field = 'name') =>
    body(field)
      .trim()
      .escape()
      .stripLow(),

  text: (field = 'text') =>
    body(field)
      .trim()
      .escape(),

  html: (field = 'html') =>
    body(field)
      .trim(), // Don't escape HTML content, but trim

  slug: (field = 'slug') =>
    body(field)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, ''),

  phone: (field = 'phone') =>
    body(field)
      .trim()
      .replace(/\s/g, ''),

  url: (field = 'url') =>
    body(field)
      .trim()
      .toLowerCase(),
};

/**
 * Sanitize entire request body (remove undefined, null, empty values)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const sanitizeRequestBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    // Remove undefined and null values
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined || req.body[key] === null) {
        delete req.body[key];
      }
      // Trim strings
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

/**
 * XSS Protection middleware
 */
export const xssProtection = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        // Basic XSS protection
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/onerror=/gi, '')
          .replace(/onclick=/gi, '')
          .replace(/onload=/gi, '');
      }
    });
  }
  next();
};

export default {
  sanitizeBody,
  sanitizeQuery,
  sanitizations,
  sanitizeRequestBody,
  xssProtection,
};