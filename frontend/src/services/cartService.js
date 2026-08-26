// frontend/src/services/cartService.js
import { api } from './api';

export const cartService = {
  // Get cart
  async getCart() {
    const response = await api.get('/cart');
    return response.data.data;
  },

  // Add item to cart
  async addItem(productId, quantity = 1, variant = null) {
    const response = await api.post('/cart', { productId, quantity, variant });
    return response.data.data;
  },

  // Update item quantity
  async updateItem(itemId, quantity) {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data.data;
  },

  // Remove item from cart
  async removeItem(itemId) {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data.data;
  },

  // Clear cart
  async clearCart() {
    const response = await api.delete('/cart');
    return response.data.data;
  },

  // Sync guest cart with server
  async syncCart(items) {
    const response = await api.post('/cart/sync', { items });
    return response.data.data;
  },
};

export default cartService;