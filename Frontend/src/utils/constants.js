// API Base URL
export const API_BASE_URL = 'http://localhost:5000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  UPDATE_PASSWORD: '/auth/update-password',
  VERIFY_EMAIL: '/auth/verify-email',
};

// User endpoints
export const USER_ENDPOINTS = {
  ALL: '/users',
  SINGLE: (id) => `/users/${id}`,
  PROFILE: '/users/profile',
  SELLER: (id) => `/users/sellers/${id}`,
  VERIFY_SELLER: (id) => `/users/verify-seller/${id}`,
};

// Content endpoints
export const CONTENT_ENDPOINTS = {
  ALL: '/content',
  CATEGORIES: '/content/categories',
  TRENDING: '/content/trending',
  SINGLE: (id) => `/content/${id}`,
  SELLER_CONTENT: '/content/seller/me',
  UPLOAD: '/content/upload',
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  ALL: '/orders',
  SINGLE: (id) => `/orders/${id}`,
  BUYER_ORDERS: '/orders/buyer',
  SELLER_ORDERS: '/orders/seller',
  DOWNLOAD: (id) => `/orders/${id}/download`,
};

// Bid endpoints
export const BID_ENDPOINTS = {
  ALL: '/bids',
  SINGLE: (id) => `/bids/${id}`,
  CANCEL: (id) => `/bids/${id}/cancel`,
  CONTENT_BIDS: (contentId) => `/bids/content/${contentId}`,
  USER_BIDS: '/bids/user',
  END_AUCTION: (contentId) => `/bids/end-auction/${contentId}`,
};

// Request endpoints
export const REQUEST_ENDPOINTS = {
  ALL: '/requests',
  SINGLE: (id) => `/requests/${id}`,
  RESPOND: (id) => `/requests/${id}/respond`,
  CANCEL: (id) => `/requests/${id}/cancel`,
  SUBMIT: (id) => `/requests/${id}/submit`,
  BUYER_REQUESTS: '/requests/buyer',
  SELLER_REQUESTS: '/requests/seller',
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  ALL: '/payments',
  SINGLE: (id) => `/payments/${id}`,
  CREATE_INTENT: '/payments/create-intent',
  CONFIRM: '/payments/confirm',
  BUYER_PAYMENTS: '/payments/buyer',
  SELLER_PAYMENTS: '/payments/seller',
  PAYOUT: (id) => `/payments/${id}/payout`,
};

// Notification endpoints
export const NOTIFICATION_ENDPOINTS = {
  ALL: '/notifications',
  USER_NOTIFICATIONS: '/notifications/me',
  READ: (id) => `/notifications/${id}/read`,
  READ_ALL: '/notifications/read-all',
  UNREAD_COUNT: '/notifications/unread-count',
};

// CMS endpoints
export const CMS_ENDPOINTS = {
  ALL: '/cms',
  PUBLISHED: '/cms/published',
  SINGLE: (slug) => `/cms/${slug}`,
  CONTACT: '/cms/contact',
};

// Settings endpoints
export const SETTINGS_ENDPOINTS = {
  ALL: '/settings',
  PUBLIC: '/settings/public',
  SINGLE: (id) => `/settings/${id}`,
};

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: '/dashboard/stats',
  USERS: '/dashboard/users',
  CONTENT: '/dashboard/content',
  ORDERS: '/dashboard/orders',
  REVENUE: '/dashboard/revenue',
  ACTIVITY: '/dashboard/activity',
};

// Review endpoints
export const REVIEW_ENDPOINTS = {
  ALL: '/reviews',
  SINGLE: (id) => `/reviews/${id}`,
  CONTENT_REVIEWS: (contentId) => `/reviews/content/${contentId}`,
  SELLER_REVIEWS: (sellerId) => `/reviews/seller/${sellerId}`,
};

// Message endpoints
export const MESSAGE_ENDPOINTS = {
  CONVERSATIONS: '/messages/conversations',
  CONVERSATION: (id) => `/messages/conversations/${id}`,
  ARCHIVE: (id) => `/messages/conversations/${id}/archive`,
  MESSAGES: (conversationId) => `/messages/conversations/${conversationId}/messages`,
  READ: (conversationId) => `/messages/conversations/${conversationId}/read`,
  UNREAD_COUNT: '/messages/unread-count',
};

// Wishlist endpoints
export const WISHLIST_ENDPOINTS = {
  ALL: '/wishlist',
  REMOVE: (contentId) => `/wishlist/${contentId}`,
  CHECK: (contentId) => `/wishlist/check/${contentId}`,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'xosportshub_token',
  USER: 'xosportshub_user',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  BUYER: 'buyer',
};
