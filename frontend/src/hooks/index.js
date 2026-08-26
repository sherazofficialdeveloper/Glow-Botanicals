// frontend/src/hooks/index.js
export { useAuth } from './useAuth.js';
export { useCart } from './useCart.js';
export { useWishlist } from './useWishlist.js';
export { useProducts, useFeaturedProducts, useRelatedProducts } from './useProducts.js';
export { useProduct, useProductById } from './useProduct.js';
export { useOrders, useOrder } from './useOrders.js';
export { useReviews, useProductReviews } from './useReviews.js';
export { useCategories, useCategory, useCategoryProducts } from './useCategories.js';
export { useBanners } from './useBanners.js';
export { useToast } from './useToast.js';
export { useFAQ } from './useFAQ.js';
export { useDebounce } from './useDebounce.js';
export { useLocalStorage } from './useLocalStorage.js';
export { useBlogPosts, useBlogPost } from './useBlog.js'; 
export { 
  useMediaQuery, 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop,
  useIsSmallScreen,
  useIsLargeScreen,
} from './useMediaQuery.js';

export default {
  useAuth,
  useCart,
  useWishlist,
  useProducts,
  useFeaturedProducts,
  useRelatedProducts,
  useProduct,
  useProductById,
  useOrders,
  useOrder,
  useReviews,
  useProductReviews,
  useCategories,
  useCategory,
  useCategoryProducts,
  useBanners,
  useToast,
  useDebounce,
  useLocalStorage,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsSmallScreen,
  useIsLargeScreen,
};