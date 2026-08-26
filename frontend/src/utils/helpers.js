// frontend/src/utils/helpers.js

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn, limit = 300) => {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const generateId = (length = 8, prefix = '') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + result;
};

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

export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toSentenceCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

export const omit = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return {};
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

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

export const parseQueryString = (query) => {
  if (!query) return {};
  const params = {};
  const searchParams = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};

export default {
  sleep,
  debounce,
  throttle,
  slugify,
  generateId,
  getInitials,
  capitalize,
  toSentenceCase,
  deepClone,
  pick,
  omit,
  getNestedValue,
  setNestedValue,
  toQueryString,
  parseQueryString,
};