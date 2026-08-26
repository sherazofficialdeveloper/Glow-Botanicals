// backend/src/middleware/validate.js
import { validationResult, body, param, query } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    } catch (error) {
      next(error);
    }
  };
};

export const commonValidations = {
  id: (field = 'id') => param(field).isMongoId().withMessage('Invalid ID format'),
  email: (field = 'email') => body(field).isEmail().withMessage('Valid email is required').normalizeEmail(),
  password: (field = 'password') => body(field).isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  phone: (field = 'phone') => body(field).optional().isMobilePhone().withMessage('Valid phone is required'),
  name: (field = 'name') => body(field).isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters').trim(),
  url: (field = 'url') => body(field).optional().isURL().withMessage('Valid URL is required'),
  number: (field = 'number') => body(field).isNumeric().withMessage('Must be a number'),
  boolean: (field = 'boolean') => body(field).isBoolean().withMessage('Must be a boolean'),
  page: (field = 'page') => query(field).optional().isInt({ min: 1 }).withMessage('Page must be positive integer').toInt(),
  limit: (field = 'limit') => query(field).optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50').toInt(),
};

export default validate;