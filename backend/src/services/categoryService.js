// backend/src/services/categoryService.js

import mongoose from 'mongoose';

import Category from '../models/Category.js';
import Product from '../models/Product.js';

import { AppError } from '../utils/error.js';

// ============================================================
// HELPERS
// ============================================================

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

// ============================================================
// GET CATEGORIES
// ============================================================

export const getCategories = async (
  includeInactive = false
) => {
  const filter = includeInactive
    ? {}
    : {
        isActive: true,
      };

  return Category.find(filter)
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

// ============================================================
// GET CATEGORY BY ID
// ============================================================

export const getCategoryById = async (
  categoryId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      categoryId
    )
  ) {
    throw new AppError(
      'Invalid category ID',
      400
    );
  }

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

  return category;
};

// ============================================================
// GET CATEGORY BY SLUG
// ============================================================

export const getCategoryBySlug = async (
  slug
) => {
  const category =
    await Category.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });

  if (!category) {
    throw new AppError(
      'Category not found',
      404
    );
  }

  return category;
};

// ============================================================
// CREATE CATEGORY
// ============================================================

export const createCategory = async (
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

  const cleanName = name.trim();

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

// ============================================================
// UPDATE CATEGORY
// ============================================================

export const updateCategory = async (
  categoryId,
  data
) => {
  const category =
    await getCategoryById(
      categoryId
    );

  if (data.name !== undefined) {
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

  if (
    data.description !==
    undefined
  ) {
    category.description =
      data.description;
  }

  if (
    data.image !==
    undefined
  ) {
    category.image =
      data.image;
  }

  if (
    data.imagePublicId !==
    undefined
  ) {
    category.imagePublicId =
      data.imagePublicId;
  }

  if (
    data.isActive !==
    undefined
  ) {
    category.isActive =
      Boolean(data.isActive);
  }

  if (
    data.sortOrder !==
    undefined
  ) {
    category.sortOrder =
      Number(
        data.sortOrder
      ) || 0;
  }

  await category.save();

  return category;
};

// ============================================================
// DELETE CATEGORY
// ============================================================

export const deleteCategory = async (
  categoryId
) => {
  const category =
    await getCategoryById(
      categoryId
    );

  const productCount =
    await Product.countDocuments({
      category: category._id,
    });

  if (productCount > 0) {
    throw new AppError(
      `Cannot delete category. ${productCount} product(s) are using this category.`,
      400
    );
  }

  await category.deleteOne();

  return true;
};

// ============================================================
// GET PRODUCTS BY CATEGORY
// ============================================================

export const getProductsByCategory =
  async (
    slug,
    page = 1,
    limit = 12
  ) => {
    const category =
      await Category.findOne({
        slug: slug.toLowerCase(),
        isActive: true,
      });

    if (!category) {
      throw new AppError(
        'Category not found',
        404
      );
    }

    const currentPage =
      Math.max(
        parseInt(page, 10) || 1,
        1
      );

    const perPage =
      Math.min(
        Math.max(
          parseInt(limit, 10) || 12,
          1
        ),
        100
      );

    const skip =
      (currentPage - 1) *
      perPage;

    const filter = {
      category: category._id,
      isActive: true,
    };

    const [
      products,
      totalCount,
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
        .limit(perPage)
        .lean(),

      Product.countDocuments(
        filter
      ),
    ]);

    return {
      items: products,
      totalCount,
      totalPages: Math.ceil(
        totalCount / perPage
      ),
      currentPage,
      category,
    };
  };

export default {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
};