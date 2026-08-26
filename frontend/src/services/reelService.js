// frontend/src/services/reelService.js
import { api } from './api';

export const reelService = {
  async getReels(params = {}) {
    const response = await api.get('/reels', { params });
    return response.data.data.items || [];
  },
};

export default reelService;