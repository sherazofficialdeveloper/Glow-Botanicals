// frontend/src/middleware/index.js
export { authMiddleware } from './auth.js';
export { default as auth } from './auth.js';

export default {
  auth: authMiddleware,
};