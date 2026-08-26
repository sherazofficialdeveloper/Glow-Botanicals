import mongoose from 'mongoose';

import Product from '../models/Product.js';

import { AppError } from '../utils/error.js';

import { slugify } from '../utils/helpers.js';

import logger from '../utils/logger.js';

import cloudinary from '../config/cloudinary.js';

// ============================================================
// HELPERS
// ============================================================

const escapeRegex = (value) => {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
};

const getSafePagination = (
  page,
  limit
) => {
  let pageNumber = Number(page);
  let limitNumber = Number(limit);

  if (
    !Number.isFinite(pageNumber) ||
    pageNumber < 1
  ) {
    pageNumber = 1;
  }

  if (
    !Number.isFinite(limitNumber) ||
    limitNumber < 1
  ) {
    limitNumber = 12;
  }

  limitNumber = Math.min(
    limitNumber,
    100
  );

  return {
    pageNumber: Math.floor(pageNumber),
    limitNumber: Math.floor(limitNumber),
  };
};

const validateObjectId = (
  value,
  fieldName = 'ID'
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      value
    )
  ) {
    throw new AppError(
      `Invalid ${fieldName}`,
      400
    );
  }
};

// ============================================================
// GET PRODUCTS
// ============================================================

export const getProducts = async (
  filters = {}
) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'featured',
      category,
      search,
      minPrice,
      maxPrice,
      rating,
      isActive = true,
    } = filters;

    const {
      pageNumber,
      limitNumber,
    } = getSafePagination(
      page,
      limit
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    const filter = {};

    // ========================================================
    // ACTIVE FILTER
    // ========================================================

    if (
      isActive === true ||
      isActive === 'true'
    ) {
      filter.isActive = true;
    } else if (
      isActive === false ||
      isActive === 'false'
    ) {
      filter.isActive = false;
    }

    // ========================================================
    // CATEGORY
    // ========================================================

    if (category) {
      validateObjectId(
        category,
        'category ID'
      );

      filter.category = category;
    }

    // ========================================================
    // SEARCH
    // ========================================================

    if (search?.trim()) {
      const safeSearch =
        escapeRegex(
          search.trim()
        );

      const searchRegex =
        new RegExp(
          safeSearch,
          'i'
        );

      filter.$or = [
        {
          name: searchRegex,
        },
        {
          description:
            searchRegex,
        },
        {
          tags: {
            $in: [searchRegex],
          },
        },
      ];
    }

    // ========================================================
    // PRICE FILTER
    // ========================================================

    const hasMinPrice =
      minPrice !== undefined &&
      minPrice !== '' &&
      Number.isFinite(
        Number(minPrice)
      );

    const hasMaxPrice =
      maxPrice !== undefined &&
      maxPrice !== '' &&
      Number.isFinite(
        Number(maxPrice)
      );

    if (
      hasMinPrice ||
      hasMaxPrice
    ) {
      if (
        hasMinPrice &&
        hasMaxPrice &&
        Number(minPrice) >
          Number(maxPrice)
      ) {
        throw new AppError(
          'Minimum price cannot be greater than maximum price',
          400
        );
      }

      filter.price = {};

      if (hasMinPrice) {
        filter.price.$gte =
          Number(minPrice);
      }

      if (hasMaxPrice) {
        filter.price.$lte =
          Number(maxPrice);
      }
    }

    // ========================================================
    // RATING FILTER
    // ========================================================

    if (
      rating !== undefined &&
      rating !== ''
    ) {
      const ratingNumber =
        Number(rating);

      if (
        !Number.isFinite(
          ratingNumber
        ) ||
        ratingNumber < 0 ||
        ratingNumber > 5
      ) {
        throw new AppError(
          'Rating must be between 0 and 5',
          400
        );
      }

      filter.rating = {
        $gte: ratingNumber,
      };
    }

    // ========================================================
    // SORTING
    // ========================================================

    let sortOptions;

    switch (sort) {
      case 'newest':
        sortOptions = {
          createdAt: -1,
        };
        break;

      case 'oldest':
        sortOptions = {
          createdAt: 1,
        };
        break;

      case 'price-low':
        sortOptions = {
          price: 1,
        };
        break;

      case 'price-high':
        sortOptions = {
          price: -1,
        };
        break;

      case 'rating':
        sortOptions = {
          rating: -1,
          reviewCount: -1,
        };
        break;

      case 'popularity':
        sortOptions = {
          soldCount: -1,
          viewCount: -1,
        };
        break;

      case 'featured':
      default:
        sortOptions = {
          isFeatured: -1,
          createdAt: -1,
        };
        break;
    }

    // ========================================================
    // DATABASE QUERY
    // ========================================================

    const [
      items,
      totalCount,
    ] = await Promise.all([
      Product.find(filter)
        .populate(
          'category',
          'name slug'
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber),

      Product.countDocuments(filter),
    ]);

    return {
      items,
      totalCount,
      totalPages:
        Math.ceil(
          totalCount /
            limitNumber
        ),
      currentPage:
        pageNumber,
      limit:
        limitNumber,
    };
  } catch (error) {
    logger.error(
      'Get products error:',
      error
    );

    throw error;
  }
};

// ============================================================
// GET PRODUCT BY ID
// ============================================================

export const getProductById = async (
  productId
) => {
  validateObjectId(
    productId,
    'product ID'
  );

  const product =
    await Product.findById(
      productId
    ).populate(
      'category',
      'name slug'
    );

  if (!product) {
    throw new AppError(
      'Product not found',
      404
    );
  }

  return product;
};

// ============================================================
// GET PRODUCT BY SLUG
// ============================================================

export const getProductBySlug = async (
  slug
) => {
  if (!slug?.trim()) {
    throw new AppError(
      'Product slug is required',
      400
    );
  }

  const product =
    await Product.findOne({
      slug: slug
        .trim()
        .toLowerCase(),
    }).populate(
      'category',
      'name slug'
    );

  if (!product) {
    throw new AppError(
      'Product not found',
      404
    );
  }

  // Count views only for active products
  if (product.isActive) {
    product.viewCount =
      (product.viewCount || 0) +
      1;

    await product.save();
  }

  return product;
};

// ============================================================
// FEATURED PRODUCTS
// ============================================================

export const getFeaturedProducts =
  async (limit = 6) => {
    const safeLimit =
      Math.min(
        Math.max(
          Number(limit) || 6,
          1
        ),
        50
      );

    return Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate(
        'category',
        'name slug'
      )
      .sort({
        createdAt: -1,
      })
      .limit(safeLimit);
  };

// ============================================================
// RELATED PRODUCTS
// ============================================================

export const getRelatedProducts =
  async (
    productId,
    category,
    limit = 4
  ) => {
    validateObjectId(
      productId,
      'product ID'
    );

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      throw new AppError(
        'Product not found',
        404
      );
    }

    const relatedCategory =
      category ||
      product.category;

    if (!relatedCategory) {
      return [];
    }

    validateObjectId(
      relatedCategory.toString(),
      'category ID'
    );

    const safeLimit =
      Math.min(
        Math.max(
          Number(limit) || 4,
          1
        ),
        20
      );

    return Product.find({
      _id: {
        $ne: productId,
      },
      category:
        relatedCategory,
      isActive: true,
    })
      .populate(
        'category',
        'name slug'
      )
      .sort({
        rating: -1,
        reviewCount: -1,
        createdAt: -1,
      })
      .limit(safeLimit);
  };

// ============================================================
// CREATE PRODUCT
// ============================================================

export const createProduct =
  async (productData) => {
    try {
      const {
        name,
        description,
        price,
        originalPrice,
        category,
        stock = 0,
        images = [],
        imagePublicIds = [],
        isActive = true,
        isFeatured = false,
        tags = [],
        features = [],
        ingredients = [],
        howToUse = '',
        benefits = [],
        sku,
        variants = [],
        specifications = {},
      } = productData;

      // ======================================================
      // BASIC VALIDATION
      // ======================================================

      if (!name?.trim()) {
        throw new AppError(
          'Product name is required',
          400
        );
      }

      if (!description?.trim()) {
        throw new AppError(
          'Product description is required',
          400
        );
      }

      if (!category) {
        throw new AppError(
          'Category is required',
          400
        );
      }

      validateObjectId(
        category,
        'category ID'
      );

      const numericPrice =
        Number(price);

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        throw new AppError(
          'Invalid product price',
          400
        );
      }

      // ======================================================
      // ORIGINAL PRICE
      // ======================================================

      let numericOriginalPrice =
        null;

      if (
        originalPrice !==
          undefined &&
        originalPrice !== null &&
        originalPrice !== ''
      ) {
        numericOriginalPrice =
          Number(
            originalPrice
          );

        if (
          !Number.isFinite(
            numericOriginalPrice
          ) ||
          numericOriginalPrice < 0
        ) {
          throw new AppError(
            'Invalid original price',
            400
          );
        }
      }

      // ======================================================
      // STOCK
      // ======================================================

      const numericStock =
        Number(stock);

      if (
        !Number.isFinite(
          numericStock
        ) ||
        numericStock < 0
      ) {
        throw new AppError(
          'Invalid stock value',
          400
        );
      }

      // ======================================================
      // SLUG
      // ======================================================

      const slug =
        slugify(name.trim());

      const existing =
        await Product.findOne({
          slug,
        });

      if (existing) {
        throw new AppError(
          'Product with this name already exists',
          409
        );
      }

      // ======================================================
      // CREATE PRODUCT
      // ======================================================

      const product =
        await Product.create({
          name:
            name.trim(),

          slug,

          description:
            description.trim(),

          price:
            numericPrice,

          originalPrice:
            numericOriginalPrice,

          category,

          stock:
            Math.floor(
              numericStock
            ),

          images:
            Array.isArray(images)
              ? images
              : [],

          imagePublicIds:
            Array.isArray(
              imagePublicIds
            )
              ? imagePublicIds
              : [],

          isActive:
            Boolean(isActive),

          isFeatured:
            Boolean(isFeatured),

          tags:
            Array.isArray(tags)
              ? tags
              : [],

          features:
            Array.isArray(
              features
            )
              ? features
              : [],

          ingredients:
            Array.isArray(
              ingredients
            )
              ? ingredients
              : [],

          howToUse:
            howToUse || '',

          benefits:
            Array.isArray(
              benefits
            )
              ? benefits
              : [],

          sku:
            sku?.trim() || null,

          variants:
            Array.isArray(
              variants
            )
              ? variants
              : [],

          specifications:
            specifications || {},
        });

      return product;
    } catch (error) {
      logger.error(
        'Create product error:',
        error
      );

      throw error;
    }
  };

// ============================================================
// UPDATE PRODUCT
// ============================================================

export const updateProduct =
  async (
    productId,
    updateData
  ) => {
    try {
      validateObjectId(
        productId,
        'product ID'
      );

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        throw new AppError(
          'Product not found',
          404
        );
      }

      // ======================================================
      // NAME + SLUG
      // ======================================================

      if (
        updateData.name !==
        undefined
      ) {
        const newName =
          String(
            updateData.name
          ).trim();

        if (!newName) {
          throw new AppError(
            'Product name cannot be empty',
            400
          );
        }

        if (
          newName !==
          product.name
        ) {
          const newSlug =
            slugify(newName);

          const existing =
            await Product.findOne({
              slug: newSlug,
              _id: {
                $ne: productId,
              },
            });

          if (existing) {
            throw new AppError(
              'Product with this name already exists',
              409
            );
          }

          product.name =
            newName;

          product.slug =
            newSlug;
        }
      }

      // ======================================================
      // DESCRIPTION
      // ======================================================

      if (
        updateData.description !==
        undefined
      ) {
        const description =
          String(
            updateData.description
          ).trim();

        if (
          description.length <
          20
        ) {
          throw new AppError(
            'Description must be at least 20 characters',
            400
          );
        }

        product.description =
          description;
      }

      // ======================================================
      // CATEGORY
      // ======================================================

      if (
        updateData.category !==
        undefined
      ) {
        validateObjectId(
          updateData.category,
          'category ID'
        );

        product.category =
          updateData.category;
      }

      // ======================================================
      // PRICE
      // ======================================================

      if (
        updateData.price !==
        undefined
      ) {
        const price =
          Number(
            updateData.price
          );

        if (
          !Number.isFinite(
            price
          ) ||
          price < 0
        ) {
          throw new AppError(
            'Invalid product price',
            400
          );
        }

        product.price =
          price;
      }

      // ======================================================
      // ORIGINAL PRICE
      // ======================================================

      if (
        updateData.originalPrice !==
        undefined
      ) {
        if (
          updateData.originalPrice ===
            null ||
          updateData.originalPrice ===
            ''
        ) {
          product.originalPrice =
            null;
        } else {
          const originalPrice =
            Number(
              updateData.originalPrice
            );

          if (
            !Number.isFinite(
              originalPrice
            ) ||
            originalPrice < 0
          ) {
            throw new AppError(
              'Invalid original price',
              400
            );
          }

          product.originalPrice =
            originalPrice;
        }
      }

      // ======================================================
      // STOCK
      // ======================================================

      if (
        updateData.stock !==
        undefined
      ) {
        const stock =
          Number(
            updateData.stock
          );

        if (
          !Number.isFinite(
            stock
          ) ||
          stock < 0
        ) {
          throw new AppError(
            'Invalid stock value',
            400
          );
        }

        product.stock =
          Math.floor(stock);
      }

      // ======================================================
      // STATUS
      // ======================================================

      if (
        updateData.isActive !==
        undefined
      ) {
        product.isActive =
          Boolean(
            updateData.isActive
          );
      }

      if (
        updateData.isFeatured !==
        undefined
      ) {
        product.isFeatured =
          Boolean(
            updateData.isFeatured
          );
      }

      // ======================================================
      // ARRAYS
      // ======================================================

      const arrayFields = [
        'tags',
        'features',
        'ingredients',
        'benefits',
        'variants',
      ];

      arrayFields.forEach(
        (field) => {
          if (
            updateData[field] !==
            undefined
          ) {
            product[field] =
              Array.isArray(
                updateData[field]
              )
                ? updateData[field]
                : [];
          }
        }
      );

      // ======================================================
      // HOW TO USE
      // ======================================================

      if (
        updateData.howToUse !==
        undefined
      ) {
        product.howToUse =
          String(
            updateData.howToUse
          );
      }

      // ======================================================
      // SKU
      // ======================================================

      if (
        updateData.sku !==
        undefined
      ) {
        product.sku =
          updateData.sku
            ?.toString()
            .trim() || null;
      }

      // ======================================================
      // SPECIFICATIONS
      // ======================================================

      if (
        updateData.specifications !==
        undefined
      ) {
        product.specifications =
          updateData.specifications ||
          {};
      }

      // ======================================================
      // IMAGES
      // ======================================================

      if (
        updateData.images !==
        undefined
      ) {
        product.images =
          Array.isArray(
            updateData.images
          )
            ? updateData.images
            : [];
      }

      if (
        updateData.imagePublicIds !==
        undefined
      ) {
        product.imagePublicIds =
          Array.isArray(
            updateData.imagePublicIds
          )
            ? updateData.imagePublicIds
            : [];
      }

      await product.save();

      return product;
    } catch (error) {
      logger.error(
        'Update product error:',
        error
      );

      throw error;
    }
  };

// ============================================================
// DELETE PRODUCT
// ============================================================

export const deleteProduct =
  async (productId) => {
    try {
      validateObjectId(
        productId,
        'product ID'
      );

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        throw new AppError(
          'Product not found',
          404
        );
      }

      // ======================================================
      // DELETE CLOUDINARY IMAGES
      // ======================================================

      if (
        product.imagePublicIds
          ?.length
      ) {
        await Promise.all(
          product.imagePublicIds.map(
            async (publicId) => {
              if (!publicId) {
                return;
              }

              try {
                await cloudinary.uploader.destroy(
                  publicId
                );
              } catch (error) {
                logger.error(
                  `Failed to delete Cloudinary image ${publicId}:`,
                  error
                );
              }
            }
          )
        );
      }

      // ======================================================
      // DELETE PRODUCT
      // ======================================================

      await product.deleteOne();

      return true;
    } catch (error) {
      logger.error(
        'Delete product error:',
        error
      );

      throw error;
    }
  };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};