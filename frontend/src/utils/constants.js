// frontend/src/utils/constants.js

// ============================================================
// APP CONSTANTS
// ============================================================

export const APP = {
  name: 'Glowly Botanical',
  tagline: 'Luxury Skincare & Beauty',
  description: 'Glowly Botanical - Luxury Skincare & Beauty Products',
  version: '1.0.0',
};

// ============================================================
// API ENDPOINTS
// ============================================================

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
  // Products
  products: {
    list: '/products',
    featured: '/products/featured',
    search: '/products/search',
    related: (id) => `/products/${id}/related`,
  },
  // Orders
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id) => `/orders/${id}`,
    status: (id) => `/orders/${id}/status`,
  },
  // Cart
  cart: {
    get: '/cart',
    add: '/cart/items',
    update: (id) => `/cart/items/${id}`,
    remove: (id) => `/cart/items/${id}`,
    clear: '/cart',
    sync: '/cart/sync',
  },
  // Wishlist
  wishlist: {
    get: '/wishlist',
    add: '/wishlist/items',
    remove: (id) => `/wishlist/items/${id}`,
    clear: '/wishlist',
    sync: '/wishlist/sync',
  },
  // Reviews
  reviews: {
    list: '/reviews',
    create: '/reviews',
    update: (id) => `/reviews/${id}`,
    delete: (id) => `/reviews/${id}`,
    approve: (id) => `/reviews/${id}/approve`,
    product: (productId) => `/reviews/product/${productId}`,
  },
  // Admin
  admin: {
    dashboard: '/admin/dashboard/stats',
    users: '/admin/users',
    orders: '/admin/orders',
    products: '/admin/products',
    categories: '/admin/categories',
    banners: '/admin/banners',
    settings: '/admin/settings',
  },
};

// ============================================================
// PAGINATION
// ============================================================

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
  options: [12, 24, 48, 96],
};

// ============================================================
// ORDER STATUS
// ============================================================

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'warning' },
  paid: { label: 'Paid', color: 'success' },
  processing: { label: 'Processing', color: 'info' },
  shipped: { label: 'Shipped', color: 'primary' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
  rejected: { label: 'Rejected', color: 'danger' },
  refunded: { label: 'Refunded', color: 'secondary' },
};

// ============================================================
// PAYMENT METHODS
// ============================================================

export const PAYMENT_METHODS = {
  paypal: { label: 'PayPal', icon: 'Wallet' },
  stripe: { label: 'Credit Card', icon: 'CreditCard' },
  cod: { label: 'Cash on Delivery', icon: 'Truck' },
  afterpay: { label: 'Afterpay', icon: 'Clock' },
  klarna: { label: 'Klarna', icon: 'ShoppingBag' },
};

// ============================================================
// SHIPPING
// ============================================================

export const SHIPPING = {
  freeThreshold: 35,
  standardCost: 5.99,
  expressCost: 12.99,
};

// ============================================================
// STORAGE KEYS
// ============================================================

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
  guestCart: 'guestCart',
  guestWishlist: 'guestWishlist',
  theme: 'theme',
  recentSearches: 'recentSearches',
  announcementClosed: 'announcementClosed',
};

// ============================================================
// SOCIAL LINKS
// ============================================================

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/glowlyangel',
  facebook: 'https://facebook.com/glowlybotanical',
  youtube: 'https://youtube.com/glowlybotanical',
  twitter: 'https://twitter.com/glowlybotanical',
  tiktok: 'https://tiktok.com/@glowlybotanical',
};

// ============================================================
// CONTACT INFO
// ============================================================

export const CONTACT = {
  email: 'hello@glowlybotanical.com',
  phone: '+1 (800) 555-GLOW',
  address: '123 Beauty Lane, New York, NY 10001',
  workingHours: 'Mon-Fri: 9:00 AM - 6:00 PM EST',
};

export default {
  APP,
  API_ENDPOINTS,
  PAGINATION,
  ORDER_STATUS,
  PAYMENT_METHODS,
  SHIPPING,
  STORAGE_KEYS,
  SOCIAL_LINKS,
  CONTACT,
};