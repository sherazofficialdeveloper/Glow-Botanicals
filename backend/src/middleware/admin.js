// backend/src/middleware/admin.js

import { AuthError, ForbiddenError } from '../utils/error.js';

export const admin = (req, res, next) => {
  if (!req.user) {
    return next(new AuthError('Authentication required.'));
  }

  if (req.user.role !== 'admin') {
    return next(new ForbiddenError('Admin access required.'));
  }

  next();
};

export default admin;
