// backend/src/utils/sanitize.js

/**
 * Sanitize a string (trim, remove extra spaces)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize email (trim, lowercase)
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

/**
 * Sanitize phone (remove non-digit characters)
 * @param {string} phone - Phone to sanitize
 * @returns {string} Sanitized phone
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/\D/g, '');
};

/**
 * Sanitize slug (lowercase, only letters, numbers, hyphens)
 * @param {string} slug - Slug to sanitize
 * @returns {string} Sanitized slug
 */
export const sanitizeSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return '';
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Sanitize HTML (remove script tags and dangerous attributes)
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '');
};

/**
 * Sanitize URL
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL or empty string
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return '';
  }
};

/**
 * Sanitize number (convert to number, clamp between min and max)
 * @param {*} value - Value to sanitize
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Sanitized number
 */
export const sanitizeNumber = (value, min = undefined, max = undefined) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  let result = num;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  return result;
};

/**
 * Sanitize array (remove empty values)
 * @param {Array} arr - Array to sanitize
 * @param {boolean} removeEmpty - Whether to remove empty values
 * @returns {Array} Sanitized array
 */
export const sanitizeArray = (arr, removeEmpty = true) => {
  if (!Array.isArray(arr)) return [];
  if (!removeEmpty) return [...arr];
  return arr.filter(item => item !== null && item !== undefined && item !== '');
};

/**
 * Sanitize object (remove keys with null/undefined/empty values)
 * @param {Object} obj - Object to sanitize
 * @param {Array} keepKeys - Keys to keep even if empty
 * @returns {Object} Sanitized object
 */
export const sanitizeObject = (obj, keepKeys = []) => {
  if (!obj || typeof obj !== 'object') return {};
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (keepKeys.includes(key)) {
      result[key] = value;
      continue;
    }
    if (value !== null && value !== undefined && value !== '') {
      result[key] = typeof value === 'string' ? sanitizeString(value) : value;
    }
  }
  return result;
};

export default {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeSlug,
  sanitizeHtml,
  sanitizeUrl,
  sanitizeNumber,
  sanitizeArray,
  sanitizeObject,
};