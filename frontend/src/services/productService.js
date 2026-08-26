// frontend/src/services/productService.js
import { api } from './api';

export const productService = {
  // Get all products with filters
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  // Get product by ID
  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data.data.product;
  },

  // Get product by slug
  async getProductBySlug(slug) {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data.data.product;
  },

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data.data.products;
  },

  // Get related products
  async getRelatedProducts(id, limit = 4) {
    const response = await api.get(`/products/${id}/related`, { params: { limit } });
    return response.data.data.products;
  },

  // NOTE: review fetching/creation for a product is handled by
  // reviewService.js (GET /reviews?productId=..., POST /reviews), which
  // is what the product page actually uses via the useProductReviews
  // hook. getProductReviews() used to live here pointing at a
  // GET /products/:id/reviews route that doesn't exist on the backend
  // and had no callers — removed rather than left as dead/misleading.

  // Create review (authenticated) — POST /products/:id/reviews does
  // exist on the backend, kept for parity, though the live product page
  // currently submits via reviewService.createReview() instead.
  async createReview(productId, data) {
    const response = await api.post(`/products/${productId}/reviews`, data);
    return response.data.data;
  },

  // Admin: Create product
  async createProduct(data) {
    const response = await api.post('/products', data);
    return response.data.data.product;
  },

  // Admin: Update product
  async updateProduct(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data.product;
  },

  // Admin: Delete product
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Admin: Upload images
  async uploadImages(formData) {
    const response = await api.post('/products/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.images;
  },

  // Admin: Delete image
  async deleteImage(publicId) {
    const response = await api.delete('/products/images', { data: { publicId } });
    return response.data;
  },
};

export default productService;