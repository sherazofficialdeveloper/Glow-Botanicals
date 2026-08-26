// frontend/src/services/blogService.js
import { api } from './api';

export const blogService = {
  // Get all blog posts
  async getPosts(params = {}) {
    const response = await api.get('/blog', { params });
    return response.data.data || { items: [], totalCount: 0, totalPages: 1 };
  },

  // Get single blog post by slug
  async getPostBySlug(slug) {
    const response = await api.get(`/blog/${slug}`);
    return response.data.data;
  },

  // Get blog post by ID
  async getPostById(id) {
    const response = await api.get(`/blog/id/${id}`);
    return response.data.data;
  },

  // Get featured blog posts
  async getFeaturedPosts(limit = 3) {
    const response = await api.get('/blog/featured', { params: { limit } });
    return response.data.data || [];
  },

  // Get blog posts by category
  async getPostsByCategory(category, params = {}) {
    const response = await api.get(`/blog/category/${category}`, { params });
    return response.data.data || { items: [], totalCount: 0, totalPages: 1 };
  },

  // Search blog posts
  async searchPosts(query) {
    const response = await api.get('/blog/search', { params: { q: query } });
    return response.data.data || [];
  },
};

export default blogService;
