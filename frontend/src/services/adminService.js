// frontend/src/services/adminService.js
import { api } from './api';

export const adminService = {
  // ============================================================
  // DASHBOARD
  // ============================================================

  // Get dashboard stats
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
  },

  // ============================================================
  // USERS
  // ============================================================

  // Get all users
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
  },

  // Get single user
  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data.user;
  },

  // Update user role
  // NOTE: no updateUserRole method — role changes are database-only by
  // explicit product requirement. There is no backend endpoint for
  // this (removed deliberately), so this method is not exposed here.

  // Toggle user active status
  async toggleUserActive(id) {
    const response = await api.put(`/admin/users/${id}/toggle-active`);
    return response.data.data.user;
  },

  // Delete user
  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // ============================================================
  // ORDERS
  // ============================================================

  // Get all orders
  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', { params });
    return response.data.data;
  },

  // Get single order
  async getOrder(id) {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data.data.order;
  },

  // Update order status
  async updateOrderStatus(id, status) {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data.data.order;
  },

  // Delete order
  async deleteOrder(id) {
    const response = await api.delete(`/admin/orders/${id}`);
    return response.data;
  },

  // ============================================================
  // PRODUCTS
  // ============================================================

  // Get all products (admin)
  async getProducts(params = {}) {
    const response = await api.get('/admin/products', { params });
    return response.data.data;
  },

  // NOTE: fetching a single product for the admin edit form uses the
  // public GET /products/:id route via the useProduct hook — there is
  // no separate GET /admin/products/:id on the backend, and nothing
  // called this method, so it's removed rather than left dead/misleading.

  // Create product (admin)
  async createProduct(data) {
    const response = await api.post('/admin/products', data);
    return response.data.data.product;
  },

  // Update product (admin)
  async updateProduct(id, data) {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data.data.product;
  },

  // Delete product (admin)
  async deleteProduct(id) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // ============================================================
  // CATEGORIES
  // ============================================================

  // Get all categories (admin)
  async getCategories(params = {}) {
    const response = await api.get('/admin/categories', { params });
    return response.data.data.items;
  },

  // Get single category (admin)
  async getCategory(id) {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data.data.category;
  },

  // Create category (admin)
  async createCategory(data) {
    const response = await api.post('/admin/categories', data);
    return response.data.data.category;
  },

  // Update category (admin)
  async updateCategory(id, data) {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data.data.category;
  },

  // Delete category (admin)
  async deleteCategory(id) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // NOTE: admin banner management (list/create/update/delete) was
  // removed per product requirement. Banners are no longer managed
  // through the Admin Panel — the public homepage still reads them via
  // the standalone, unauthenticated bannerService.getBanners().

  // ============================================================
  // BEFORE-AFTER
  // ============================================================

  // Get all before-after items (admin)
  async getBeforeAfter() {
    const response = await api.get('/admin/before-after');
    return response.data.data.items;
  },

  // Get single before-after item (admin)
  async getBeforeAfterItem(id) {
    const response = await api.get(`/admin/before-after/${id}`);
    return response.data.data.item;
  },

  // Create before-after item (admin)
  async createBeforeAfter(data) {
    const response = await api.post('/admin/before-after', data);
    return response.data.data.item;
  },

  // Upload before-after images (admin)
  async uploadBeforeAfterImages(formData) {
    const response = await api.post('/admin/before-after/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.images;
  },

  // Update before-after item (admin)
  async updateBeforeAfter(id, data) {
    const response = await api.put(`/admin/before-after/${id}`, data);
    return response.data.data.item;
  },

  // Delete before-after item (admin)
  async deleteBeforeAfter(id) {
    const response = await api.delete(`/admin/before-after/${id}`);
    return response.data;
  },

  // ============================================================
  // VIDEOS
  // ============================================================

  // Get all videos (admin)
  async getVideos() {
    const response = await api.get('/admin/videos');
    return response.data.data.items;
  },

  // Get single video (admin)
  async getVideo(id) {
    const response = await api.get(`/admin/videos/${id}`);
    return response.data.data.video;
  },

  // Create video (admin)
  async createVideo(data) {
    const response = await api.post('/admin/videos', data);
    return response.data.data.video;
  },

  // Update video (admin)
  async updateVideo(id, data) {
    const response = await api.put(`/admin/videos/${id}`, data);
    return response.data.data.video;
  },

  // Delete video (admin)
  async deleteVideo(id) {
    const response = await api.delete(`/admin/videos/${id}`);
    return response.data;
  },

  // ============================================================
  // COUPONS
  // ============================================================

  // Get all coupons (admin)
  async getCoupons() {
    const response = await api.get('/coupons/admin');
    return response.data.data.items;
  },

  // Get single coupon (admin)
  async getCoupon(id) {
    const response = await api.get(`/coupons/admin/${id}`);
    return response.data.data.coupon;
  },

  // Create coupon (admin)
  async createCoupon(data) {
    const response = await api.post('/coupons/admin', data);
    return response.data.data.coupon;
  },

  // Update coupon (admin)
  async updateCoupon(id, data) {
    const response = await api.put(`/coupons/admin/${id}`, data);
    return response.data.data.coupon;
  },

  // Delete coupon (admin)
  async deleteCoupon(id) {
    const response = await api.delete(`/coupons/admin/${id}`);
    return response.data;
  },

  // ============================================================
  // REVIEWS (Admin)
  // ============================================================

  // Get all reviews (admin)
  async getReviews(params = {}) {
    const response = await api.get('/reviews/admin', { params });
    return response.data.data;
  },

  // Get single review (admin)
  async getReview(id) {
    const response = await api.get(`/reviews/admin/${id}`);
    return response.data.data;
  },

  // Create review (admin)
  async createReview(data) {
    const response = await api.post('/reviews/admin', data);
    return response.data.data;
  },

  // Approve review (admin)
  async approveReview(id) {
    const response = await api.put(`/reviews/admin/${id}/approve`);
    return response.data.data;
  },

  // Reject review (admin)
  async rejectReview(id) {
    const response = await api.put(`/reviews/admin/${id}/reject`);
    return response.data.data;
  },

  // Delete review (admin)
  async deleteReview(id) {
    const response = await api.delete(`/reviews/admin/${id}`);
    return response.data;
  },

  // NOTE: Pages (CMS) admin management was removed per product
  // requirement — the Page model/controller/routes no longer exist.

  // ============================================================
  // SETTINGS
  // ============================================================

  // Get settings (admin)
  async getSettings() {
    const response = await api.get('/admin/settings');
    return response.data.data.settings;
  },

  // Update settings (admin)
  async updateSettings(data) {
    const response = await api.put('/admin/settings', data);
    return response.data.data.settings;
  },

  // Get payment settings (admin) — payment fields live on the single
  // shared Settings document, same one getSettings/updateSettings use.
  async getPaymentSettings() {
    const response = await api.get('/admin/settings');
    return response.data.data.settings;
  },

  // Update payment settings (admin)
  async updatePaymentSettings(data) {
    const response = await api.put('/admin/settings', data);
    return response.data.data.settings;
  },

  // Get shipping settings (admin) — same shared Settings document
  async getShippingSettings() {
    const response = await api.get('/admin/settings');
    return response.data.data.settings;
  },

  // Update shipping settings (admin)
  async updateShippingSettings(data) {
    const response = await api.put('/admin/settings', data);
    return response.data.data.settings;
  },
};

export default adminService;