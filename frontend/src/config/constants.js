// config/constants.js

// App Constants
export const APP = {
  name: 'Glow  Botanical',
  tagline: 'Luxury Skincare & Beauty',
  description: 'Glow  Botanical - Luxury Skincare & Beauty Products',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  version: '1.0.0',
};

// Routes
export const ROUTES = {
  // Public
  home: '/',
  products: '/products',
  product: (slug) => `/products/${slug}`,
  categories: '/categories',
  category: (slug) => `/categories/${slug}`,
  cart: '/cart',
  checkout: '/checkout',
  orderConfirmation: (id) => `/order-confirmation/${id}`,
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  blog: '/blog',
  blogPost: (slug) => `/blog/${slug}`,
  privacy: '/privacy-policy',
  terms: '/terms',

  // Auth
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',

  // Dashboard
  dashboard: '/dashboard',
  orders: '/dashboard/orders',
  orderDetail: (id) => `/dashboard/orders/${id}`,
  wishlist: '/dashboard/wishlist',
  profile: '/dashboard/profile',
  addresses: '/dashboard/addresses',
  reviews: '/dashboard/reviews',
  settings: '/dashboard/settings',

  // Admin
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminProducts: '/admin/products',
  adminProductAdd: '/admin/products/add',
  adminProductEdit: (id) => `/admin/products/edit/${id}`,
  adminCategories: '/admin/categories',
  adminOrders: '/admin/orders',
  adminOrderDetail: (id) => `/admin/orders/${id}`,
  adminCustomers: '/admin/customers',
  adminBanners: '/admin/banners',
  adminReviews: '/admin/reviews',
  adminCoupons: '/admin/coupons',
  adminSettings: '/admin/settings',
  adminPayments: '/admin/payments-verification',
};

// API Endpoints
export const API = {
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
  products: {
    list: '/products',
    featured: '/products/featured',
    search: '/products/search',
    related: (id) => `/products/${id}/related`,
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id) => `/orders/${id}`,
    status: (id) => `/orders/${id}/status`,
  },
  cart: {
    get: '/cart',
    add: '/cart/items',
    update: (id) => `/cart/items/${id}`,
    remove: (id) => `/cart/items/${id}`,
    clear: '/cart',
    merge: '/cart/merge',
  },
  wishlist: {
    get: '/wishlist',
    add: '/wishlist/items',
    remove: (id) => `/wishlist/items/${id}`,
    clear: '/wishlist',
  },
  reviews: {
    list: '/reviews',
    create: '/reviews',
    update: (id) => `/reviews/${id}`,
    delete: (id) => `/reviews/${id}`,
    approve: (id) => `/reviews/${id}/approve`,
    product: (productId) => `/reviews/product/${productId}`,
  },
  admin: {
    products: '/admin/products',
    orders: '/admin/orders',
    categories: '/admin/categories',
    banners: '/admin/banners',
    coupons: '/admin/coupons',
    users: '/admin/users',
    settings: '/admin/settings',
  },
  payments: {
    create: '/payments/create',
    verify: '/payments/verify',
    paypal: '/payments/paypal',
  },
};

// Pagination
export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
  options: [12, 24, 48, 96],
};

// Product Constants
export const PRODUCT = {
  sortOptions: [
    { id: 'newest', label: 'Newest First' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'rating', label: 'Highest Rated' },
  ],
  filterOptions: {
    categories: ['All', 'Oil', 'Serum', 'Lotion', 'Wash', 'Set'],
    priceRanges: [
      { id: 'under-25', label: 'Under $25' },
      { id: '25-50', label: '$25 - $50' },
      { id: '50-100', label: '$50 - $100' },
      { id: 'over-100', label: 'Over $100' },
    ],
  },
};

// Order Constants
export const ORDER = {
  status: {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  statusColors: {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  },
  paymentStatus: {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
  },
};

// User Constants
export const USER = {
  roles: {
    user: 'user',
    admin: 'admin',
  },
  defaultAvatar: '/images/default-avatar.png',
};

// Cart Constants
export const CART = {
  freeShippingThreshold: 35,
  maxQuantity: 10,
};

// Payment Constants
export const PAYMENT = {
  methods: [
    { id: 'paypal', label: 'PayPal', icon: 'Wallet' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'Truck' },
    { id: 'stripe', label: 'Credit / Debit Card', icon: 'CreditCard' },
  ],
  defaultMethod: 'paypal',
};

// Validation Constants
export const VALIDATION = {
  password: {
    minLength: 8,
    maxLength: 100,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
  phone: {
    pattern: /^\+?[\d\s-]{10,15}$/,
  },
  zipCode: {
    pattern: /^[0-9]{5}(-[0-9]{4})?$/,
  },
};

// File Upload Constants
export const UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  maxImages: 5,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
  cart: 'guestCart',
  wishlist: 'wishlist',
  recentSearches: 'recentSearches',
  theme: 'theme',
  announcementClosed: 'announcementClosed',
};

// Cookie Keys
export const COOKIE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

// Social Links
export const SOCIAL = {
  instagram: 'https://instagram.com/Glow Botanical',
  facebook: 'https://facebook.com/Glow botanical',
  youtube: 'https://youtube.com/Glow botanical',
  twitter: 'https://twitter.com/Glow botanical',
  tiktok: 'https://tiktok.com/@Glow botanical',
};

// Contact Info
export const CONTACT = {
  email: 'hello@Glow botanical.com',
  phone: '+1 (800) 555-GLOW',
  address: '123 Beauty Lane, New York, NY 10001',
  workingHours: 'Mon-Fri: 9:00 AM - 6:00 PM EST',
};

export default {
  APP,
  ROUTES,
  API,
  PAGINATION,
  PRODUCT,
  ORDER,
  USER,
  CART,
  PAYMENT,
  VALIDATION,
  UPLOAD,
  STORAGE_KEYS,
  COOKIE_KEYS,
  SOCIAL,
  CONTACT,
};