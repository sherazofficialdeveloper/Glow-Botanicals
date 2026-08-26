// backend/src/config/jwt.js

import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
};

const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const generateToken = (payload, expiresIn = JWT_EXPIRE) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  get secret() {
    return process.env.JWT_SECRET;
  },
  expire: JWT_EXPIRE,
  generateToken,
  verifyToken,
  decodeToken,
};
