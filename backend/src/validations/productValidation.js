import {
  body,
  param,
  query,
} from 'express-validator';

// ============================================================
// CREATE / UPDATE PRODUCT
// ============================================================

export const productValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage(
      'Product name must be between 3 and 100 characters'
    )
    .trim(),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({
      min: 20,
    })
    .withMessage(
      'Description must be at least 20 characters'
    )
    .trim(),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({
      min: 0,
    })
    .withMessage(
      'Price must be a positive number'
    ),

  body('originalPrice')
    .optional({
      nullable: true,
    })
    .isFloat({
      min: 0,
    })
    .withMessage(
      'Original price must be a positive number'
    ),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({
      min: 0,
    })
    .withMessage(
      'Stock must be a positive integer'
    ),

  body('images')
    .optional()
    .isArray()
    .withMessage(
      'Images must be an array'
    ),

  body('images.*')
    .optional()
    .isURL()
    .withMessage(
      'Invalid image URL'
    ),

  body('imagePublicIds')
    .optional()
    .isArray()
    .withMessage(
      'Image public IDs must be an array'
    ),

  body('tags')
    .optional()
    .isArray()
    .withMessage(
      'Tags must be an array'
    ),

  body('features')
    .optional()
    .isArray()
    .withMessage(
      'Features must be an array'
    ),

  body('ingredients')
    .optional()
    .isArray()
    .withMessage(
      'Ingredients must be an array'
    ),

  body('benefits')
    .optional()
    .isArray()
    .withMessage(
      'Benefits must be an array'
    ),

  body('howToUse')
    .optional()
    .isString()
    .withMessage(
      'How to use must be a string'
    ),

  body('variants')
    .optional()
    .isArray()
    .withMessage(
      'Variants must be an array'
    ),

  body('specifications')
    .optional()
    .isObject()
    .withMessage(
      'Specifications must be an object'
    ),

  body('sku')
    .optional({
      nullable: true,
    })
    .isString()
    .withMessage(
      'SKU must be a string'
    ),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage(
      'isActive must be a boolean'
    ),

  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage(
      'isFeatured must be a boolean'
    ),
];

// ============================================================
// PRODUCT ID
// ============================================================

export const productIdValidation = [
  param('id')
    .isMongoId()
    .withMessage(
      'Invalid product ID'
    ),
];

// ============================================================
// PRODUCT SLUG
// ============================================================

export const productSlugValidation = [
  param('slug')
    .notEmpty()
    .withMessage(
      'Product slug is required'
    )
    .trim(),
];

// ============================================================
// PRODUCT FILTERS
// ============================================================

export const productFilterValidation = [
  query('page')
    .optional({ values: 'falsy' })
    .isInt({
      min: 1,
    })
    .withMessage(
      'Page must be a positive integer'
    )
    .toInt(),

  query('limit')
    .optional({ values: 'falsy' })
    .isInt({
      min: 1,
      max: 50,
    })
    .withMessage(
      'Limit must be between 1 and 50'
    )
    .toInt(),

  query('sort')
    .optional({ values: 'falsy' })
    .isIn([
      'featured',
      'newest',
      'oldest',
      'price-low',
      'price-high',
      'rating',
      'popularity',
    ])
    .withMessage(
      'Invalid sort option'
    ),

  query('category')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage(
      'Invalid category ID'
    ),

  query('search')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage(
      'Search query must be a string'
    ),

  query('minPrice')
    .optional({ values: 'falsy' })
    .isFloat({
      min: 0,
    })
    .withMessage(
      'Min price must be a positive number'
    ),

  query('maxPrice')
    .optional({ values: 'falsy' })
    .isFloat({
      min: 0,
    })
    .withMessage(
      'Max price must be a positive number'
    ),

  query('rating')
    .optional({ values: 'falsy' })
    .isFloat({
      min: 0,
      max: 5,
    })
    .withMessage(
      'Rating must be between 0 and 5'
    ),

  query('isActive')
    .optional({ values: 'falsy' })
    .isBoolean()
    .withMessage(
      'isActive must be a boolean'
    ),
];

// ============================================================
// REVIEW
// ============================================================

export const reviewValidation = [
  body('rating')
    .notEmpty()
    .withMessage(
      'Rating is required'
    )
    .isInt({
      min: 1,
      max: 5,
    })
    .withMessage(
      'Rating must be between 1 and 5'
    ),

  body('text')
    .notEmpty()
    .withMessage(
      'Review text is required'
    )
    .isLength({
      min: 5,
      max: 1000,
    })
    .withMessage(
      'Review must be between 5 and 1000 characters'
    )
    .trim(),
];

// ============================================================
// ALIASES
// ============================================================

export const productSchema =
  productValidation;

export const productIdSchema =
  productIdValidation;

export const productSlugSchema =
  productSlugValidation;

export const productFilterSchema =
  productFilterValidation;

export const reviewSchema =
  reviewValidation;
