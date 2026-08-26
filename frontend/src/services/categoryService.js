// frontend/src/services/categoryService.js
import { api } from './api';

export const categoryService = {
  // Get all categories
  async getCategories() {
    const response = await api.get('/categories');
    return response.data.data.items;
  },

  // Get category by slug
  async getCategoryBySlug(slug) {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data.data.category;
  },

  // Get products by category
  async getProductsByCategory(slug, page = 1, limit = 12) {
    const response = await api.get(`/categories/${slug}/products`, { params: { page, limit } });
    return response.data.data;
  },

  // Admin: Create category
  async createCategory(data) {
    const response = await api.post('/admin/categories', data);
    return response.data.data.category;
  },

  // Admin: Update category
  async updateCategory(id, data) {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data.data.category;
  },

  // Admin: Delete category
  async deleteCategory(id) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

export default categoryService;