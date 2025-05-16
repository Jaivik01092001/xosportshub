import api from './api';
import { USER_ENDPOINTS } from '../utils/constants';

/**
 * Get all users (admin only)
 * @returns {Promise} Promise with users data
 */
export const getAllUsers = async () => {
  const response = await api.get(USER_ENDPOINTS.ALL);
  return response.data;
};

/**
 * Get single user by ID (admin only)
 * @param {string} id - User ID
 * @returns {Promise} Promise with user data
 */
export const getUser = async (id) => {
  const response = await api.get(USER_ENDPOINTS.SINGLE(id));
  return response.data;
};

/**
 * Create user (admin only)
 * @param {Object} userData - User data
 * @returns {Promise} Promise with created user data
 */
export const createUser = async (userData) => {
  const response = await api.post(USER_ENDPOINTS.ALL, userData);
  return response.data;
};

/**
 * Update user (admin only)
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} Promise with updated user data
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(USER_ENDPOINTS.SINGLE(id), userData);
  return response.data;
};

/**
 * Delete user (admin only)
 * @param {string} id - User ID
 * @returns {Promise} Promise with success message
 */
export const deleteUser = async (id) => {
  const response = await api.delete(USER_ENDPOINTS.SINGLE(id));
  return response.data;
};

/**
 * Update user profile (current user)
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} Promise with updated profile data
 */
export const updateProfile = async (profileData) => {
  const response = await api.put(USER_ENDPOINTS.PROFILE, profileData);
  return response.data;
};

/**
 * Get seller profile
 * @param {string} id - Seller ID
 * @returns {Promise} Promise with seller profile data
 */
export const getSellerProfile = async (id) => {
  const response = await api.get(USER_ENDPOINTS.SELLER(id));
  return response.data;
};

/**
 * Verify seller (admin only)
 * @param {string} id - Seller ID
 * @returns {Promise} Promise with updated seller data
 */
export const verifySeller = async (id) => {
  const response = await api.put(USER_ENDPOINTS.VERIFY_SELLER(id));
  return response.data;
};

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getSellerProfile,
  verifySeller,
};
