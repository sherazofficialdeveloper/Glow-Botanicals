// backend/src/middleware/auth.js

import { AuthError, ForbiddenError } from '../utils/error.js';
import { getTokenFromRequest, verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

export const auth = catchAsync(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new AuthError('No token provided. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthError('Token expired. Please log in again.');
    }
    throw new AuthError('Invalid token. Please log in again.');
  }

  if (!decoded?.id) {
    throw new AuthError('Invalid token. Please log in again.');
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new AuthError('User not found. Please log in again.');
  }

  if (user.isActive === false) {
    throw new ForbiddenError('Account has been deactivated.');
  }

  req.user = user;
  next();
});

export default auth;
