// frontend/src/services/wishlistService.js
import { api } from './api';

export const wishlistService = {
  // ============================================================
  // WISHLIST CRUD
  // ============================================================

  // Get wishlist
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data.data;
  },

  // Toggle wishlist item (add/remove)
  async toggleWishlist(productId) {
    const response = await api.post('/wishlist/toggle', { productId });
    return response.data.data;
  },

  // Sync wishlist with server
  async syncWishlist(items) {
    const response = await api.post('/wishlist/sync', { items });
    return response.data.data;
  },

  // ============================================================
  // CHECK IF IN WISHLIST
  // ============================================================

  // Check if product is in wishlist (helper)
  async isInWishlist(productId) {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.items.some(item => item._id === productId || item === productId);
    } catch (error) {
      console.error('Failed to check wishlist:', error);
      return false;
    }
  },
};

export default wishlistService;