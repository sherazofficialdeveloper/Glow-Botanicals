// frontend/src/services/userService.js
import { api } from './api';

export const userService = {
  // ============================================================
  // PROFILE
  // ============================================================

  // Get current user
  async getMe() {
    const response = await api.get('/users/me');
    return response.data.data.user;
  },

  // Update profile
  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data.data.user;
  },

  // Upload/replace profile image — uploads to Cloudinary server-side
  // and saves the resulting URL in MongoDB. Never sends image data
  // through the plain JSON profile-update endpoint.
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.user;
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // ============================================================
  // ADDRESSES
  // ============================================================

  // Get all addresses
  async getAddresses() {
    const response = await api.get('/users/addresses');
    return response.data.data.addresses;
  },

  // Add address
  async addAddress(data) {
    const response = await api.post('/users/addresses', data);
    return response.data.data.address;
  },

  // Update address
  async updateAddress(addressId, data) {
    const response = await api.put(`/users/addresses/${addressId}`, data);
    return response.data.data.address;
  },

  // Delete address
  async deleteAddress(addressId) {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response.data;
  },

  // Set default address
  async setDefaultAddress(addressId) {
    const response = await api.put(`/users/addresses/${addressId}/default`);
    return response.data.data.address;
  },

  // ============================================================
  // STATISTICS
  // ============================================================

  // Get dashboard stats
  async getDashboardStats() {
    // This will be handled by the dashboard endpoint
    // For now, we'll get from orders and wishlist
    try {
      const [orders, wishlist] = await Promise.all([
        api.get('/orders', { params: { limit: 5 } }),
        api.get('/wishlist'),
      ]);
      
      return {
        orders: orders.data.data.totalCount || 0,
        spent: orders.data.data.totalSpent || 0,
        wishlist: wishlist.data.data.totalItems || 0,
        reviews: 0, // Will be fetched separately
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        orders: 0,
        spent: 0,
        wishlist: 0,
        reviews: 0,
      };
    }
  },
};

export default userService;