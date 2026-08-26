// backend/src/utils/jwt.js

import {
  generateToken,
  verifyToken,
  decodeToken,
} from '../config/jwt.js';

export { generateToken, verifyToken, decodeToken };

export const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1]?.trim() || null;
};

export const getUserFromToken = (token) => {
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
  getTokenFromRequest,
  getUserFromToken,
};
