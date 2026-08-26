// frontend/src/services/orderService.js
import { api } from './api';

export const orderService = {
  // Create order
  async createOrder(data) {
    const response = await api.post('/orders', data);
    return response.data.data.order;
  },

  // Get user orders
  async getOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data.data;
  },

  // Get single order
  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data.data.order;
  },

  // Update order status (admin)
  async updateOrderStatus(id, status) {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data.data.order;
  },

  // Cancel order
  async cancelOrder(id) {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data.data.order;
  },

};

export default orderService;