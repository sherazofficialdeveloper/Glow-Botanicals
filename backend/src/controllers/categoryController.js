// backend/src/controllers/categoryController.js
import catchAsync from '../utils/catchAsync.js';
import {
  getCategories as getCategoriesService,
  getCategoryById,
  getCategoryBySlug as getCategoryBySlugService,
  getProductsByCategory as getProductsByCategoryService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from '../services/categoryService.js';

export const getCategories = catchAsync(async (req, res) => {
  const includeInactive =
    req.user?.role === 'admin' && req.query.includeInactive === 'true';
  const categories = await getCategoriesService(includeInactive);
  res.json({
    success: true,
    data: {
      items: Array.isArray(categories) ? categories : [],
    },
  });
});

export const getAdminCategories = catchAsync(async (req, res) => {
  const categories = await getCategoriesService(true, {
    search: req.query.search?.trim() || '',
  });
  res.json({
    success: true,
    data: {
      items: Array.isArray(categories) ? categories : [],
    },
  });
});

export const getCategoryBySlug = catchAsync(async (req, res) => {
  const category = await getCategoryBySlugService(req.params.slug);
  res.json({
    success: true,
    data: { category },
  });
});

export const getProductsByCategory = catchAsync(async (req, res) => {
  const data = await getProductsByCategoryService(
    req.params.slug,
    req.query.page,
    req.query.limit
  );
  res.json({
    success: true,
    data,
  });
});

export const getAdminCategory = catchAsync(async (req, res) => {
  const category = await getCategoryById(req.params.id);
  res.json({
    success: true,
    data: { category },
  });
});

export const createCategory = catchAsync(async (req, res) => {
  const category = await createCategoryService(req.body);
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});

export const updateCategory = catchAsync(async (req, res) => {
  const category = await updateCategoryService(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Category updated successfully',
    data: { category },
  });
});

export const deleteCategory = catchAsync(async (req, res) => {
  await deleteCategoryService(req.params.id);
  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});

export default {
  getCategories,
  getAdminCategories,
  getCategoryBySlug,
  getProductsByCategory,
  getAdminCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};