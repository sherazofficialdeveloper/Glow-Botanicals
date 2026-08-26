// backend/src/utils/helpers.js

/**
 * Generate a slug from a string
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
export const normalizeEmail = (email) => {
  return String(email || '').trim().toLowerCase();
};

export const getRequestUserId = (user) => {
  return user?.id || user?._id || null;
};

export const slugify = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Generate a random ID
 * @param {number} length - Length of ID (default: 8)
 * @param {string} prefix - Prefix (default: '')
 * @returns {string} Random ID
 */
export const generateId = (length = 8, prefix = '') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + result;
};

/**
 * Sleep for a given time
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the timeout
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj);
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  const clonedObj = {};
  for (const key of Object.keys(obj)) {
    clonedObj[key] = deepClone(obj[key]);
  }
  return clonedObj;
};

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} Value at path
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }
  return result;
};

/**
 * Set nested value in object using dot notation
 * @param {Object} obj - Object to modify
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 * @returns {Object} Modified object (new copy)
 */
export const setNestedValue = (obj, path, value) => {
  const result = { ...obj };
  const keys = path.split('.');
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Convert object to query string
 * @param {Object} params - Parameters
 * @returns {string} Query string
 */
export const toQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

/**
 * Parse query string to object
 * @param {string} query - Query string
 * @returns {Object} Parsed parameters
 */
export const parseQueryString = (query) => {
  if (!query) return {};
  const params = {};
  const searchParams = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};

/**
 * Pick specific keys from an object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object} New object with picked keys
 */
export const pick = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return {};
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * Omit specific keys from an object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to omit
 * @returns {Object} New object without omitted keys
 */
export const omit = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return {};
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @param {number} max - Maximum initials (default: 2)
 * @returns {string} Initials
 */
export const getInitials = (name, max = 2) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .map(word => word[0])
    .filter(char => char && char.match(/[A-Za-z]/))
    .join('')
    .toUpperCase()
    .slice(0, max);
};

export default {
  normalizeEmail,
  getRequestUserId,
  slugify,
  generateId,
  sleep,
  deepClone,
  getNestedValue,
  setNestedValue,
  toQueryString,
  parseQueryString,
  pick,
  omit,
  capitalize,
  truncate,
  getInitials,
};