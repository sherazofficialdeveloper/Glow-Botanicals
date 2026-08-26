// frontend/src/utils/storage.js

export const storage = {
  // ============================================================
  // SET
  // ============================================================

  set: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  },

  // ============================================================
  // GET
  // ============================================================

  get: (key, defaultValue = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  // ============================================================
  // REMOVE
  // ============================================================

  remove: (key) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  },

  // ============================================================
  // CLEAR
  // ============================================================

  clear: () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  },

  // ============================================================
  // KEYS
  // ============================================================

  keys: () => {
    try {
      if (typeof window === 'undefined') return [];
      return Object.keys(window.localStorage);
    } catch (error) {
      console.warn('Error getting localStorage keys:', error);
      return [];
    }
  },

  // ============================================================
  // HAS
  // ============================================================

  has: (key) => {
    try {
      if (typeof window === 'undefined') return false;
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.warn(`Error checking localStorage key "${key}":`, error);
      return false;
    }
  },
};

// ============================================================
// SESSION STORAGE
// ============================================================

export const sessionStorage = {
  set: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  },

  clear: () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
      }
    } catch (error) {
      console.warn('Error clearing sessionStorage:', error);
    }
  },
};

// ============================================================
// COOKIES
// ============================================================

export const cookies = {
  set: (key, value, days = 7) => {
    try {
      if (typeof document === 'undefined') return;
      const expires = new Date(Date.now() + days * 86400000).toUTCString();
      document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
    } catch (error) {
      console.warn(`Error setting cookie "${key}":`, error);
    }
  },

  get: (key) => {
    try {
      if (typeof document === 'undefined') return null;
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === key) {
          try {
            return JSON.parse(decodeURIComponent(value));
          } catch {
            return decodeURIComponent(value);
          }
        }
      }
      return null;
    } catch (error) {
      console.warn(`Error reading cookie "${key}":`, error);
      return null;
    }
  },

  remove: (key) => {
    try {
      if (typeof document === 'undefined') return;
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } catch (error) {
      console.warn(`Error removing cookie "${key}":`, error);
    }
  },
};

export default storage;