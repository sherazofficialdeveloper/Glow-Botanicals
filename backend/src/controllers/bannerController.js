// backend/src/controllers/bannerController.js
//
// NOTE: admin banner management (create/update/delete/list-all) was
// removed per product requirement — banners are no longer managed
// through the Admin Panel. This controller now only exposes the
// public, read-only listing used by the customer-facing homepage.

import Banner from '../models/Banner.js';

// Public: only active banners, optionally filtered by type, ordered for display
export const getPublicBanners = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: { items: banners },
    });
  } catch (error) {
    next(error);
  }
};
