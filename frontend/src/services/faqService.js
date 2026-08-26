// frontend/src/services/faqService.js
import { api } from './api';

export const faqService = {
  // Get all FAQs
  async getFAQs(params = {}) {
    const response = await api.get('/faqs', { params });
    return response.data.data?.items || response.data.data || [];
  },

  // Get FAQ by ID
  async getFAQById(id) {
    const response = await api.get(`/faqs/${id}`);
    return response.data.data;
  },

  // Get FAQs by category
  async getFAQsByCategory(category) {
    const response = await api.get('/faqs', { params: { category } });
    return response.data.data?.items || response.data.data || [];
  },

  // Admin: Create FAQ
  async createFAQ(data) {
    const response = await api.post('/faqs', data);
    return response.data.data;
  },

  // Admin: Update FAQ
  async updateFAQ(id, data) {
    const response = await api.put(`/faqs/${id}`, data);
    return response.data.data;
  },

  // Admin: Delete FAQ
  async deleteFAQ(id) {
    const response = await api.delete(`/faqs/${id}`);
    return response.data;
  },
};

export default faqService;