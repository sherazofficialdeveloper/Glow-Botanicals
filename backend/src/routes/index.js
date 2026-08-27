// backend/src/routes/index.js

import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import beforeAfterRoutes from './beforeAfterRoutes.js';
import videoRoutes from './videoRoutes.js';
import couponRoutes from './couponRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import paymentWebhookRoutes from './paymentWebhookRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import adminRoutes from './adminRoutes.js';
import blogRoutes from './blogRoutes.js';
import faqRoutes from './faqRoutes.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { getPublicBanners } from '../controllers/bannerController.js';
import { getReels } from '../controllers/videoController.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/coupons', couponRoutes);
router.use('/payments/webhook', paymentWebhookRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/blog', blogRoutes);
router.use('/faqs', faqRoutes);

// Public read-only endpoints for homepage content
router.get('/banners', getPublicBanners);
router.get('/reels', getReels);
router.use('/before-after', beforeAfterRoutes);

router.use('/users', auth, userRoutes);
router.use('/orders', auth, orderRoutes);
router.use('/cart', auth, cartRoutes);
router.use('/wishlist', auth, wishlistRoutes);

router.use('/admin', auth, admin, adminRoutes);
router.use('/admin/before-after', auth, admin, beforeAfterRoutes);
router.use('/admin/videos', auth, admin, videoRoutes);
router.use('/admin/analytics', auth, admin, analyticsRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
