// backend/src/controllers/productController.js
import catchAsync from '../utils/catchAsync.js';
import * as productService from '../services/productService.js';
import * as reviewService from '../services/reviewService.js';
import { uploadImage, deleteImage } from '../utils/cloudinaryUpload.js';
import { AppError } from '../utils/error.js';

export const getProducts = catchAsync(async (req, res) => {
  const result = await productService.getProducts(req.query);
  res.json({
    success: true,
    data: result,
  });
});

export const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json({
    success: true,
    data: { product },
  });
});

export const getProductBySlug = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.json({
    success: true,
    data: { product },
  });
});

export const getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await productService.getFeaturedProducts(req.query.limit || 6);
  res.json({
    success: true,
    data: { products },
  });
});

export const getRelatedProducts = catchAsync(async (req, res) => {
  const products = await productService.getRelatedProducts(
    req.params.id,
    req.query.category,
    req.query.limit || 4
  );
  res.json({
    success: true,
    data: { products },
  });
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

export const uploadProductImages = catchAsync(async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    throw new AppError('Please select at least one image', 400);
  }

  const images = await Promise.all(
    files.map((file) => uploadImage(file.buffer, 'glow-botanical/products'))
  );

  res.status(201).json({
    success: true,
    message: 'Product images uploaded successfully',
    data: { images },
  });
});

export const deleteProductImage = catchAsync(async (req, res) => {
  if (!req.body.publicId) {
    throw new AppError('Image public ID is required', 400);
  }

  await deleteImage(req.body.publicId);
  res.json({
    success: true,
    message: 'Product image deleted successfully',
  });
});

export const getProductReviews = catchAsync(async (req, res) => {
  const data = await reviewService.getReviews({
    productId: req.params.id,
    page: req.query.page,
    limit: req.query.limit,
  });
  res.json({
    success: true,
    data,
  });
});

export const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview({
    productId: req.params.id,
    userId: req.user.id,
    name: req.user.name,
    email: req.user.email,
    rating: req.body.rating,
    text: req.body.text,
    images: req.body.images,
  });

  res.status(201).json({
    success: true,
    message: 'Review submitted for approval',
    data: review,
  });
});

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getProductReviews,
  createReview,
};