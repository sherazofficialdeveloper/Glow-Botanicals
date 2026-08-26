// backend/src/controllers/index.js
import * as authController from './authController.js';
import * as userController from './userController.js';
import * as productController from './productController.js';
import * as categoryController from './categoryController.js';
import * as orderController from './orderController.js';
import * as cartController from './cartController.js';
import * as wishlistController from './wishlistController.js';
import * as reviewController from './reviewController.js';
import * as bannerController from './bannerController.js';
import * as beforeAfterController from './beforeAfterController.js';
import * as videoController from './videoController.js';
import * as couponController from './couponController.js';
import * as settingsController from './settingsController.js';
import * as pageController from './pageController.js';
import * as paymentController from './paymentController.js';
import * as analyticsController from './analyticsController.js';
import * as adminController from './adminController.js';

export {
  authController,
  userController,
  productController,
  categoryController,
  orderController,
  cartController,
  wishlistController,
  reviewController,
  bannerController,
  beforeAfterController,
  videoController,
  couponController,
  settingsController,
  pageController,
  paymentController,
  analyticsController,
  adminController,
};

export default {
  auth: authController,
  user: userController,
  product: productController,
  category: categoryController,
  order: orderController,
  cart: cartController,
  wishlist: wishlistController,
  review: reviewController,
  banner: bannerController,
  beforeAfter: beforeAfterController,
  video: videoController,
  coupon: couponController,
  settings: settingsController,
  page: pageController,
  payment: paymentController,
  analytics: analyticsController,
  admin: adminController,
};