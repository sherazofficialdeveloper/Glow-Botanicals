// frontend/src/services/bannerService.js
import { api } from './api';

export const bannerService = {
  // Get all banners (public)
  async getBanners(params = {}) {
    const response = await api.get('/banners', { params });
    return response.data.data?.items || response.data.data || [];
  },

  // NOTE: admin banner CRUD (get by id, create, update, delete) lives in
  // adminService.js, hitting the real /admin/banners/* endpoints. The
  // methods that used to be here (getBannerById/createBanner/updateBanner/
  // deleteBanner hitting plain /banners/:id) had no backend route and no
  // callers anywhere in the app — removed rather than left as a dead,
  // misleading duplicate.
};

export default bannerService;