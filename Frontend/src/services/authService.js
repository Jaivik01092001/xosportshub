import api from './api';
import { AUTH_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with user data
 */
export const register = async (userData) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
  
  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} Promise with user data
 */
export const login = async (credentials) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
  
  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Logout user
 * @returns {Promise} Promise with success message
 */
export const logout = async () => {
  // Call the logout endpoint
  const response = await api.get(AUTH_ENDPOINTS.LOGOUT);
  
  // Clear localStorage regardless of API response
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} Promise with user data
 */
export const getCurrentUser = async () => {
  const response = await api.get(AUTH_ENDPOINTS.ME);
  return response.data;
};

/**
 * Request password reset
 * @param {Object} data - Object containing email
 * @returns {Promise} Promise with success message
 */
export const forgotPassword = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
  return response.data;
};

/**
 * Reset password with token
 * @param {string} token - Reset password token
 * @param {Object} data - Object containing new password
 * @returns {Promise} Promise with success message
 */
export const resetPassword = async (token, data) => {
  const response = await api.put(`${AUTH_ENDPOINTS.RESET_PASSWORD}/${token}`, data);
  return response.data;
};

/**
 * Update password for logged in user
 * @param {Object} data - Object containing current and new password
 * @returns {Promise} Promise with success message
 */
export const updatePassword = async (data) => {
  const response = await api.put(AUTH_ENDPOINTS.UPDATE_PASSWORD, data);
  return response.data;
};

/**
 * Verify email with token
 * @param {string} token - Email verification token
 * @returns {Promise} Promise with success message
 */
export const verifyEmail = async (token) => {
  const response = await api.get(`${AUTH_ENDPOINTS.VERIFY_EMAIL}/${token}`);
  return response.data;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Get user from localStorage
 * @returns {Object|null} User object or null
 */
export const getStoredUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
  isAuthenticated,
  getStoredUser,
};
