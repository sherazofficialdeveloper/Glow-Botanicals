// backend/src/services/adminService.js

import mongoose from 'mongoose';

import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Settings from '../models/Settings.js';
import Review from '../models/Review.js';

import { AppError } from '../utils/error.js';
import logger from '../utils/logger.js';
import { sendOrderCompletedInBackground } from './emailService.js';
// ============================================================
// HELPERS
// ============================================================

const validateObjectId = (
  value,
  label = 'ID'
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      value
    )
  ) {
    throw new AppError(
      `Invalid ${label}`,
      400
    );
  }
};

const generateSlug = (value) => {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
};

const getPagination = (
  page,
  limit
) => {
  const currentPage =
    Math.max(
      parseInt(page, 10) || 1,
      1
    );

  const perPage =
    Math.min(
      Math.max(
        parseInt(limit, 10) || 20,
        1
      ),
      100
    );

  return {
    page: currentPage,
    limit: perPage,
    skip:
      (currentPage - 1) *
      perPage,
  };
};

// ============================================================
// DASHBOARD
// ============================================================

export const getDashboardStats =
  async () => {
    try {
      const revenueResult =
        await Order.aggregate([
          {
            $match: {
              status: {
                $in: [
                  'paid',
                  'processing',
                  'shipped',
                  'delivered',
                ],
              },
            },
          },

          {
            $group: {
              _id: null,
              total: {
                $sum: '$total',
              },
            },
          },
        ]);

      const revenue =
        revenueResult[0]?.total || 0;

      const [
        orders,
        customers,
        products,
        pendingOrders,
        recentOrders,
        recentUsers,
        orderStatusDistribution,
        topProducts,
      ] = await Promise.all([
        Order.countDocuments(),

        User.countDocuments({
          role: 'customer',
        }),

        Product.countDocuments(),

        Order.countDocuments({
          status: 'pending',
        }),

        Order.find()
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .populate(
            'userId',
            'name email'
          )
          .lean(),

        User.find()
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(
            'name email createdAt role isActive'
          )
          .lean(),

        Order.aggregate([
          {
            $group: {
              _id: '$status',
              count: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              count: -1,
            },
          },
        ]),

        Product.find()
          .sort({
            soldCount: -1,
          })
          .limit(5)
          .select(
            'name price originalPrice soldCount images stock'
          )
          .populate(
            'category',
            'name slug'
          )
          .lean(),
      ]);

      return {
        stats: {
          revenue,
          orders,
          pendingOrders,
          customers,
          products,
        },

        recentOrders,
        recentUsers,
        orderStatusDistribution,
        topProducts,
      };
    } catch (error) {
      logger.error(
        'Get dashboard stats error:',
        error
      );

      throw error;
    }
  };

// ============================================================
// USERS
// ============================================================

export const getUsers = async (
  query = {}
) => {
  const {
    page,
    limit,
    skip,
  } = getPagination(
    query.page,
    query.limit
  );

  const search =
    query.search?.trim() || '';

  const role =
    query.role?.trim() || '';

  const filter = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: escapeRegex(search),
          $options: 'i',
        },
      },

      {
        email: {
          $regex: escapeRegex(search),
          $options: 'i',
        },
      },
    ];
  }

  if (role) {
    if (
      !['admin', 'customer'].includes(
        role
      )
    ) {
      throw new AppError(
        'Invalid role. Use admin or customer.',
        400
      );
    }

    filter.role = role;
  }

  const [
    users,
    total,
  ] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,

    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(
        total / limit
      ),
    },
  };
};

// ============================================================
// GET USER
// ============================================================

export const getUserById =
  async (
    userId
  ) => {
    validateObjectId(
      userId,
      'user ID'
    );

    const user =
      await User.findById(userId)
        .select('-password')
        .lean();

    if (!user) {
      throw new AppError(
        'User not found',
        404
      );
    }

    const [
      orderStats,
      recentOrders,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            userId:
              new mongoose.Types.ObjectId(
                userId
              ),
          },
        },

        {
          $group: {
            _id: null,

            totalOrders: {
              $sum: 1,
            },

            totalSpent: {
              $sum: '$total',
            },
          },
        },
      ]),

      Order.find({
        userId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean(),
    ]);

    return {
      user,

      orderStats: {
        totalOrders:
          orderStats[0]
            ?.totalOrders || 0,

        totalSpent:
          orderStats[0]
            ?.totalSpent || 0,
      },

      recentOrders,
    };
  };

// ============================================================
// UPDATE USER ROLE
// ============================================================

// NOTE: no updateUserRole service — role changes are database-only by
// explicit product requirement. Not exposed via any controller/route.

// ============================================================
// TOGGLE USER
// ============================================================

export const toggleUserActive =
  async (
    userId,
    currentUser
  ) => {
    validateObjectId(
      userId,
      'user ID'
    );

    const user =
      await User.findById(userId);

    if (!user) {
      throw new AppError(
        'User not found',
        404
      );
    }

    if (
      user._id.toString() ===
      currentUser._id.toString()
    ) {
      throw new AppError(
        'You cannot deactivate your own account',
        403
      );
    }

    user.isActive =
      !user.isActive;

    await user.save();

    return {
      _id: user._id,
      name: user.name,
      isActive:
        user.isActive,
    };
  };

// ============================================================
// DELETE USER
// ============================================================

export const deleteUser =
  async (
    userId,
    currentUser
  ) => {
    validateObjectId(
      userId,
      'user ID'
    );

    const user =
      await User.findById(userId);

    if (!user) {
      throw new AppError(
        'User not found',
        404
      );
    }

    if (
      user._id.toString() ===
      currentUser._id.toString()
    ) {
      throw new AppError(
        'You cannot delete your own account',
        403
      );
    }

    if (user.role === 'admin') {
      throw new AppError(
        'Admin accounts cannot be deleted from this panel.',
        403
      );
    }

    const orderCount =
      await Order.countDocuments({
        userId: user._id,
      });

    if (orderCount > 0) {
      throw new AppError(
        'User has existing orders. Deactivate the account instead of deleting it.',
        403
      );
    }

    await user.deleteOne();
  };

// ============================================================
// ORDERS
// ============================================================

const validOrderStatuses = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'rejected',
  'cancelled',
  'refunded',
];

export const getOrders = async (
  query = {}
) => {
  const {
    page,
    limit,
    skip,
  } = getPagination(
    query.page,
    query.limit
  );

  const status =
    query.status?.trim() || '';

  const search =
    query.search?.trim() || '';

  const filter = {};

  if (status) {
    if (
      !validOrderStatuses.includes(
        status
      )
    ) {
      throw new AppError(
        'Invalid order status.',
        400
      );
    }

    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        orderNumber: {
          $regex: escapeRegex(search),
          $options: 'i',
        },
      },

      {
        customerEmail: {
          $regex: escapeRegex(search),
          $options: 'i',
        },
      },

      {
        customerName: {
          $regex: escapeRegex(search),
          $options: 'i',
        },
      },
    ];
  }

  const [
    orders,
    total,
  ] = await Promise.all([
    Order.find(filter)
      .populate(
        'userId',
        'name email phone'
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,

    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(
        total / limit
      ),
    },
  };
};

// ============================================================
// GET ORDER
// ============================================================

export const getOrderById =
  async (
    orderId
  ) => {
    validateObjectId(
      orderId,
      'order ID'
    );

    const order =
      await Order.findById(orderId)
        .populate(
          'userId',
          'name email phone addresses'
        )
        .populate(
          'coupon',
          'code discountType discountValue'
        )
        .lean();

    if (!order) {
      throw new AppError(
        'Order not found',
        404
      );
    }

    return order;
  };

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export const updateOrderStatus =
  async (
    orderId,
    data
  ) => {
    validateObjectId(
      orderId,
      'order ID'
    );

    const {
      status,
      trackingNumber,
    } = data;

    if (
      !validOrderStatuses.includes(
        status
      )
    ) {
      throw new AppError(
        `Invalid status. Must be one of: ${validOrderStatuses.join(
          ', '
        )}`,
        400
      );
    }

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      throw new AppError(
        'Order not found',
        404
      );
    }

    const oldStatus =
      order.status;

    order.status = status;

    if (
      trackingNumber !== undefined
    ) {
      order.trackingNumber =
        trackingNumber
          ?.trim() || null;
    }

    if (
      status === 'shipped' &&
      !order.shippedAt
    ) {
      order.shippedAt =
        new Date();
    }

    if (
      status === 'delivered' &&
      !order.deliveredAt
    ) {
      order.deliveredAt =
        new Date();
    }

    await order.save();

    if (oldStatus !== 'delivered' && status === 'delivered') {
      sendOrderCompletedInBackground(order, {
        email: order.customerEmail,
        name: order.customerName,
      });
    }

    logger.info(
      `Order ${order.orderNumber} status changed from ${oldStatus} to ${status}`
    );

    return order;
  };

// ============================================================
// DELETE ORDER
// ============================================================

export const deleteOrder =
  async (
    orderId
  ) => {
    validateObjectId(
      orderId,
      'order ID'
    );

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      throw new AppError(
        'Order not found',
        404
      );
    }

    const protectedStatuses = [
      'paid',
      'processing',
      'shipped',
      'delivered',
    ];

    if (
      protectedStatuses.includes(
        order.status
      )
    ) {
      throw new AppError(
        'Cannot delete processed orders. Mark as cancelled or refunded instead.',
        403
      );
    }

    await order.deleteOne();
  };

// ============================================================
// CATEGORIES
// ============================================================

export const getCategories =
  async () => {
    return Category.find()
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .lean();
  };

export const getCategoryById =
  async (
    categoryId
  ) => {
    validateObjectId(
      categoryId,
      'category ID'
    );

    const category =
      await Category.findById(
        categoryId
      );

    if (!category) {
      throw new AppError(
        'Category not found',
        404
      );
    }

    const productCount =
      await Product.countDocuments({
        category: category._id,
      });

    return {
      ...category.toObject(),
      productCount,
    };
  };

export const createCategory =
  async (
    data
  ) => {
    const {
      name,
      description = '',
      image = null,
      imagePublicId = null,
      isActive = true,
      sortOrder = 0,
    } = data;

    if (!name?.trim()) {
      throw new AppError(
        'Category name is required',
        400
      );
    }

    const cleanName =
      name.trim();

    const slug =
      generateSlug(cleanName);

    const existing =
      await Category.findOne({
        $or: [
          {
            slug,
          },
          {
            name: {
              $regex: `^${escapeRegex(
                cleanName
              )}$`,
              $options: 'i',
            },
          },
        ],
      });

    if (existing) {
      throw new AppError(
        'Category already exists',
        409
      );
    }

    return Category.create({
      name: cleanName,
      slug,
      description:
        description?.trim() || '',
      image,
      imagePublicId,
      isActive:
        Boolean(isActive),
      sortOrder:
        Number(sortOrder) || 0,
    });
  };

export const updateCategory =
  async (
    categoryId,
    data
  ) => {
    validateObjectId(
      categoryId,
      'category ID'
    );

    const category =
      await Category.findById(
        categoryId
      );

    if (!category) {
      throw new AppError(
        'Category not found',
        404
      );
    }

    if (
      data.name !== undefined
    ) {
      const cleanName =
        data.name.trim();

      if (!cleanName) {
        throw new AppError(
          'Category name cannot be empty',
          400
        );
      }

      const slug =
        generateSlug(cleanName);

      const existing =
        await Category.findOne({
          slug,
          _id: {
            $ne: category._id,
          },
        });

      if (existing) {
        throw new AppError(
          'Category already exists',
          409
        );
      }

      category.name =
        cleanName;

      category.slug =
        slug;
    }

    const fields = [
      'description',
      'image',
      'imagePublicId',
    ];

    fields.forEach((field) => {
      if (
        data[field] !== undefined
      ) {
        category[field] =
          data[field];
      }
    });

    if (
      data.isActive !== undefined
    ) {
      category.isActive =
        Boolean(data.isActive);
    }

    if (
      data.sortOrder !== undefined
    ) {
      category.sortOrder =
        Number(
          data.sortOrder
        ) || 0;
    }

    await category.save();

    return category;
  };

export const deleteCategory =
  async (
    categoryId
  ) => {
    validateObjectId(
      categoryId,
      'category ID'
    );

    const category =
      await Category.findById(
        categoryId
      );

    if (!category) {
      throw new AppError(
        'Category not found',
        404
      );
    }

    const productCount =
      await Product.countDocuments({
        category: category._id,
      });

    if (productCount > 0) {
      throw new AppError(
        `Cannot delete category with ${productCount} products. Reassign or delete products first.`,
        403
      );
    }

    await category.deleteOne();
  };

// ============================================================
// PRODUCTS
// ============================================================

export const getProducts =
  async (
    query = {}
  ) => {
    const {
      page,
      limit,
      skip,
    } = getPagination(
      query.page,
      query.limit
    );

    const search =
      query.search?.trim() || '';

    const category =
      query.category?.trim() || '';

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: escapeRegex(
              search
            ),
            $options: 'i',
          },
        },

        {
          sku: {
            $regex: escapeRegex(
              search
            ),
            $options: 'i',
          },
        },
      ];
    }

    if (category) {
      validateObjectId(
        category,
        'category ID'
      );

      filter.category =
        category;
    }

    if (
      query.isActive !==
      undefined
    ) {
      filter.isActive =
        query.isActive ===
        'true';
    }

    if (
      query.isFeatured !==
      undefined
    ) {
      filter.isFeatured =
        query.isFeatured ===
        'true';
    }

    const [
      products,
      total,
    ] = await Promise.all([
      Product.find(filter)
        .populate(
          'category',
          'name slug'
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(
        filter
      ),
    ]);

    return {
      items: products,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(
          total / limit
        ),
      },
    };
  };

// ============================================================
// GET PRODUCT
// ============================================================

export const getProductById =
  async (
    productId
  ) => {
    validateObjectId(
      productId,
      'product ID'
    );

    const product =
      await Product.findById(
        productId
      )
        .populate(
          'category',
          'name slug'
        )
        .lean();

    if (!product) {
      throw new AppError(
        'Product not found',
        404
      );
    }

    return product;
  };

// ============================================================
// CREATE PRODUCT
// ============================================================

export const createProduct =
  async (
    data
  ) => {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      images = [],
      imagePublicIds = [],
      stock = 0,
      isActive = true,
      isFeatured = false,
      ingredients = [],
      howToUse = '',
      benefits = [],
      features = [],
      tags = [],
      variants = [],
      specifications = {},
      sku = null,
    } = data;

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

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {
      throw new AppError(
        'Valid product price is required',
        400
      );
    }

    validateObjectId(
      category,
      'category ID'
    );

    const categoryExists =
      await Category.findById(
        category
      );

    if (!categoryExists) {
      throw new AppError(
        'Category not found',
        404
      );
    }

    const cleanName =
      name.trim();

    const existingProduct =
      await Product.findOne({
        name: {
          $regex: `^${escapeRegex(
            cleanName
          )}$`,
          $options: 'i',
        },
      });

    if (existingProduct) {
      throw new AppError(
        'Product with this name already exists',
        409
      );
    }

    const product =
      new Product({
        name: cleanName,

        slug:
          generateSlug(
            cleanName
          ),

        description:
          description.trim(),

        price: Number(price),

        originalPrice:
          originalPrice !==
            undefined &&
          originalPrice !==
            null &&
          originalPrice !== ''
            ? Number(
                originalPrice
              )
            : null,

        category,

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

        stock:
          Number(stock) || 0,

        isActive:
          Boolean(isActive),

        isFeatured:
          Boolean(isFeatured),

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

        features:
          Array.isArray(
            features
          )
            ? features
            : [],

        tags:
          Array.isArray(tags)
            ? tags
            : [],

        variants:
          Array.isArray(
            variants
          )
            ? variants
            : [],

        specifications:
          specifications || {},

        sku:
          sku?.trim() || null,
      });

    await product.save();

    return product;
  };

// ============================================================
// UPDATE PRODUCT
// ============================================================

export const updateProduct =
  async (
    productId,
    data
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

    if (
      data.name !== undefined
    ) {
      const cleanName =
        data.name.trim();

      if (!cleanName) {
        throw new AppError(
          'Product name cannot be empty',
          400
        );
      }

      if (
        cleanName.toLowerCase() !==
        product.name.toLowerCase()
      ) {
        const existing =
          await Product.findOne({
            name: {
              $regex: `^${escapeRegex(
                cleanName
              )}$`,
              $options: 'i',
            },

            _id: {
              $ne: product._id,
            },
          });

        if (existing) {
          throw new AppError(
            'Product with this name already exists',
            409
          );
        }

        product.name =
          cleanName;

        product.slug =
          generateSlug(
            cleanName
          );
      }
    }

    const allowedFields = [
      'description',
      'price',
      'originalPrice',
      'category',
      'images',
      'imagePublicIds',
      'stock',
      'isActive',
      'isFeatured',
      'ingredients',
      'howToUse',
      'benefits',
      'features',
      'tags',
      'variants',
      'specifications',
      'sku',
    ];

    allowedFields.forEach(
      (field) => {
        if (
          data[field] !==
          undefined
        ) {
          product[field] =
            data[field];
        }
      }
    );

    if (
      product.category
    ) {
      validateObjectId(
        product.category,
        'category ID'
      );

      const categoryExists =
        await Category.findById(
          product.category
        );

      if (!categoryExists) {
        throw new AppError(
          'Category not found',
          404
        );
      }
    }

    await product.save();

    return product;
  };

// ============================================================
// DELETE PRODUCT
// ============================================================

export const deleteProduct =
  async (
    productId
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

    const orderCount =
      await Order.countDocuments({
        'items.productId':
          product._id,
      });

    if (orderCount > 0) {
      throw new AppError(
        `Cannot delete product with ${orderCount} orders. Archive it instead.`,
        403
      );
    }

    await product.deleteOne();
  };


  // ============================================================
// REVIEWS
// ============================================================

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({
    productId,
    isApproved: true,
  }).select('rating');

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviewCount
      : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount,
  });

  return {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount,
  };
};

// ============================================================
// GET REVIEWS - ADMIN
// ============================================================

export const getReviews = async (
  query = {}
) => {
  const {
    page,
    limit,
    skip,
  } = getPagination(
    query.page,
    query.limit
  );

  const search =
    query.search?.trim() || '';

  const status =
    query.status?.trim() || '';

  const productId =
    query.productId?.trim() || '';

  const filter = {};

  // ----------------------------------------------------------
  // STATUS FILTER
  // ----------------------------------------------------------

  if (status && status !== 'all') {
    if (
      !['approved', 'pending'].includes(
        status
      )
    ) {
      throw new AppError(
        'Invalid review status.',
        400
      );
    }

    filter.isApproved =
      status === 'approved';
  }

  // ----------------------------------------------------------
  // PRODUCT FILTER
  // ----------------------------------------------------------

  if (productId) {
    validateObjectId(
      productId,
      'product ID'
    );

    filter.productId = productId;
  }

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  if (search) {
    filter.$or = [
      {
        name: {
          $regex:
            escapeRegex(search),
          $options: 'i',
        },
      },
      {
        email: {
          $regex:
            escapeRegex(search),
          $options: 'i',
        },
      },
      {
        text: {
          $regex:
            escapeRegex(search),
          $options: 'i',
        },
      },
    ];
  }

  const [
    reviews,
    total,
  ] = await Promise.all([
    Review.find(filter)
      .populate(
        'productId',
        'name slug images'
      )
      .populate(
        'userId',
        'name email'
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Review.countDocuments(filter),
  ]);

  return {
    reviews,

    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(
        total / limit
      ),
    },
  };
};

// ============================================================
// GET SINGLE REVIEW
// ============================================================

export const getReviewById =
  async (reviewId) => {
    validateObjectId(
      reviewId,
      'review ID'
    );

    const review =
      await Review.findById(
        reviewId
      )
        .populate(
          'productId',
          'name slug images price'
        )
        .populate(
          'userId',
          'name email'
        )
        .lean();

    if (!review) {
      throw new AppError(
        'Review not found',
        404
      );
    }

    return review;
  };

// ============================================================
// CREATE REVIEW - ADMIN
// ============================================================

export const createAdminReview =
  async (data) => {
    const {
      productId,
      userId,
      name,
      email,
      rating,
      text,
      isApproved = true,
      images = [],
    } = data;

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

    if (
      userId &&
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new AppError(
        'Invalid user ID',
        400
      );
    }

    if (
      !name?.trim()
    ) {
      throw new AppError(
        'Reviewer name is required',
        400
      );
    }

    if (
      !email?.trim()
    ) {
      throw new AppError(
        'Reviewer email is required',
        400
      );
    }

    if (
      !Number.isInteger(
        Number(rating)
      ) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      throw new AppError(
        'Rating must be between 1 and 5',
        400
      );
    }

    if (
      !text?.trim() ||
      text.trim().length < 5
    ) {
      throw new AppError(
        'Review must be at least 5 characters',
        400
      );
    }

    // --------------------------------------------------------
    // If a user is selected, prevent duplicate review
    // --------------------------------------------------------

    if (userId) {
      const existing =
        await Review.findOne({
          productId,
          userId,
        });

      if (existing) {
        throw new AppError(
          'This user has already reviewed this product',
          409
        );
      }
    }

    const review =
      await Review.create({
        productId,
        userId:
          userId || undefined,
        name:
          name.trim(),
        email:
          email.trim().toLowerCase(),
        rating:
          Number(rating),
        text:
          text.trim(),
        isApproved:
          Boolean(isApproved),
        images:
          Array.isArray(images)
            ? images
            : [],
      });

    if (review.isApproved) {
      await recalculateProductRating(
        productId
      );
    }

    return review;
  };

// ============================================================
// UPDATE REVIEW
// ============================================================

export const updateReview =
  async (
    reviewId,
    data
  ) => {
    validateObjectId(
      reviewId,
      'review ID'
    );

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      throw new AppError(
        'Review not found',
        404
      );
    }

    const oldProductId =
      review.productId.toString();

    const {
      productId,
      name,
      email,
      rating,
      text,
      isApproved,
      images,
    } = data;

    // --------------------------------------------------------
    // Product
    // --------------------------------------------------------

    if (
      productId !== undefined
    ) {
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

      review.productId =
        productId;
    }

    // --------------------------------------------------------
    // Basic fields
    // --------------------------------------------------------

    if (
      name !== undefined
    ) {
      if (!name.trim()) {
        throw new AppError(
          'Reviewer name cannot be empty',
          400
        );
      }

      review.name =
        name.trim();
    }

    if (
      email !== undefined
    ) {
      if (!email.trim()) {
        throw new AppError(
          'Reviewer email cannot be empty',
          400
        );
      }

      review.email =
        email
          .trim()
          .toLowerCase();
    }

    if (
      rating !== undefined
    ) {
      if (
        !Number.isInteger(
          Number(rating)
        ) ||
        Number(rating) < 1 ||
        Number(rating) > 5
      ) {
        throw new AppError(
          'Rating must be between 1 and 5',
          400
        );
      }

      review.rating =
        Number(rating);
    }

    if (
      text !== undefined
    ) {
      if (
        !text.trim() ||
        text.trim().length < 5
      ) {
        throw new AppError(
          'Review must be at least 5 characters',
          400
        );
      }

      review.text =
        text.trim();
    }

    if (
      isApproved !== undefined
    ) {
      review.isApproved =
        Boolean(isApproved);
    }

    if (
      images !== undefined
    ) {
      review.images =
        Array.isArray(images)
          ? images
          : [];
    }

    await review.save();

    // --------------------------------------------------------
    // Recalculate old product if product changed
    // --------------------------------------------------------

    if (
      oldProductId !==
      review.productId.toString()
    ) {
      await recalculateProductRating(
        oldProductId
      );
    }

    // --------------------------------------------------------
    // Recalculate current product
    // --------------------------------------------------------

    await recalculateProductRating(
      review.productId
    );

    return review;
  };

// ============================================================
// APPROVE REVIEW
// ============================================================

export const approveReview =
  async (reviewId) => {
    validateObjectId(
      reviewId,
      'review ID'
    );

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      throw new AppError(
        'Review not found',
        404
      );
    }

    if (review.isApproved) {
      return review;
    }

    review.isApproved =
      true;

    await review.save();

    await recalculateProductRating(
      review.productId
    );

    return review;
  };
  // ============================================================
// UNAPPROVE REVIEW
// ============================================================

export const unapproveReview =
  async (reviewId) => {
    validateObjectId(
      reviewId,
      'review ID'
    );

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      throw new AppError(
        'Review not found',
        404
      );
    }

    if (!review.isApproved) {
      return review;
    }

    review.isApproved = false;

    await review.save();

    await recalculateProductRating(
      review.productId
    );

    return review;
  };
// ============================================================
// DELETE REVIEW
// ============================================================

export const deleteReview =
  async (reviewId) => {
    validateObjectId(
      reviewId,
      'review ID'
    );

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      throw new AppError(
        'Review not found',
        404
      );
    }

    const productId =
      review.productId;

    await review.deleteOne();

    await recalculateProductRating(
      productId
    );

    return true;
  };

  
// ============================================================
// SETTINGS
// ============================================================

export const getSettings =
  async () => {
    let settings =
      await Settings.findOne();

    if (!settings) {
      settings =
        await Settings.create({
          siteName:
            'Glow Botanical',

          siteDescription:
            'Premium Skincare Products',

          contactEmail:
            process.env.SMTP_USER ||
            '',

          paypalMode:
            'sandbox',

          freeShippingThreshold: 50,

          standardShippingCost: 5.99,

          taxRate: 0,

          currency: 'USD',

          maintenanceMode:
            false,
        });
    }

    return settings;
  };

export const updateSettings =
  async (
    updateData
  ) => {
    let settings =
      await Settings.findOne();

    if (!settings) {
      settings =
        new Settings();
    }

    const allowedFields = [
      'siteName',
      'siteDescription',
      'tagline',
      'contactEmail',
      'contactPhone',
      'address',
      'paypalClientId',
      'paypalSecret',
      'paypalMode',
      'paypalEnabled',
      'codEnabled',
      'codInstructions',
      'defaultPaymentMethod',
      'freeShippingThreshold',
      'standardShippingCost',
      'expressShippingCost',
      'internationalShippingCost',
      'availableCountries',
      'estimatedDeliveryDays',
      'taxRate',
      'currency',
      'currencySymbol',
      'maintenanceMode',
    ];

    allowedFields.forEach(
      (field) => {
        if (
          updateData[field] !==
          undefined
        ) {
          settings[field] =
            updateData[field];
        }
      }
    );

    await settings.save();

    return settings;
  };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getDashboardStats,

  getUsers,
  getUserById,
  toggleUserActive,
  deleteUser,

  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,

  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,

  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

  // Reviews
  getReviews,
  getReviewById,
  createAdminReview,
  updateReview,
  approveReview,
  unapproveReview,
  deleteReview,

  getSettings,
  updateSettings,
};