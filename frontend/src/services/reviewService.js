// frontend/src/services/reviewService.js
import { api } from './api';

export const reviewService = {
  // Get reviews (public)
  async getReviews(params = {}) {
    const response = await api.get('/reviews', { params });
    return response.data.data;
  },

  // Get user's review for a product
  async getUserReview(productId) {
    const response = await api.get(`/reviews/my-review/${productId}`);
    return response.data.data;
  },

  // Get the current customer's own reviews across all products
  async getMyReviews(params = {}) {
    const response = await api.get('/reviews/my-reviews', { params });
    return response.data.data;
  },

  // Delete the current customer's own review (ownership enforced server-side)
  async deleteMyReview(id) {
    const response = await api.delete(`/reviews/my-reviews/${id}`);
    return response.data;
  },

  // Create review (customer)
  async createReview(data) {
    const response = await api.post('/reviews', data);
    return response.data.data;
  },

  // Admin: Get all reviews
  async getAdminReviews(params = {}) {
    const response = await api.get('/reviews/admin', { params });
    return response.data.data;
  },

  // Admin: Get single review
  async getAdminReview(id) {
    const response = await api.get(`/reviews/admin/${id}`);
    return response.data.data;
  },

  // Admin: Create review
  async createAdminReview(data) {
    const response = await api.post('/reviews/admin', data);
    return response.data.data;
  },

  // Admin: Update review
  async updateReview(id, data) {
    const response = await api.put(`/reviews/admin/${id}`, data);
    return response.data.data;
  },

  // Admin: Approve review
  async approveReview(id) {
    const response = await api.put(`/reviews/admin/${id}/approve`);
    return response.data.data;
  },

  // Admin: Unapprove review
  async unapproveReview(id) {
    const response = await api.put(`/reviews/admin/${id}/unapprove`);
    return response.data.data;
  },

  // Admin: Delete review
  async deleteReview(id) {
    const response = await api.delete(`/reviews/admin/${id}`);
    return response.data;
  },
};

export default reviewService;