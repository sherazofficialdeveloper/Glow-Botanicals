// backend/src/controllers/reviewController.js
import catchAsync from '../utils/catchAsync.js';
import * as reviewService from '../services/reviewService.js';

export const getReviews = catchAsync(async (req, res) => {
  const data = await reviewService.getReviews(req.query);
  res.json({
    success: true,
    data,
  });
});

export const getUserReview = catchAsync(async (req, res) => {
  const review = await reviewService.getUserReview(req.params.productId, req.user.id);
  res.json({
    success: true,
    data: review,
  });
});

export const getMyReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getMyReviews(req.user.id, req.query);
  res.json({
    success: true,
    data: result,
  });
});

export const deleteOwnReview = catchAsync(async (req, res) => {
  await reviewService.deleteOwnReview(req.params.id, req.user.id);
  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

export const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview({
    productId: req.body.productId,
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

export const getAdminReviews = catchAsync(async (req, res) => {
  const data = await reviewService.getAdminReviews(req.query);
  res.json({
    success: true,
    data,
  });
});

export const getAdminReview = catchAsync(async (req, res) => {
  const review = await reviewService.getAdminReview(req.params.id);
  res.json({
    success: true,
    data: review,
  });
});

export const createAdminReview = catchAsync(async (req, res) => {
  const review = await reviewService.createAdminReview({
    ...req.body,
    userId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: review,
  });
});

export const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.body);
  res.json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

export const approveReview = catchAsync(async (req, res) => {
  const review = await reviewService.approveReview(req.params.id);
  res.json({
    success: true,
    message: 'Review approved successfully',
    data: review,
  });
});

export const rejectReview = catchAsync(async (req, res) => {
  const review = await reviewService.rejectReview(req.params.id);
  res.json({
    success: true,
    message: 'Review rejected successfully',
    data: review,
  });
});



export const unapproveReview = catchAsync(async (req, res) => {
  const review = await reviewService.unapproveReview(req.params.id);
  res.json({
    success: true,
    message: 'Review moved to pending',
    data: review,
  });
});

export const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.id);
  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

export default {
  getReviews,
  getUserReview,
  getMyReviews,
  deleteOwnReview,
  createReview,
  getAdminReviews,
  getAdminReview,
  createAdminReview,
  updateReview,
  approveReview,
  unapproveReview,
  rejectReview,
  deleteReview,
};