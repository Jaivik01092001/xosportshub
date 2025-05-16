import api from './api';
import { WISHLIST_ENDPOINTS } from '../utils/constants';

/**
 * Get user's wishlist (buyer only)
 * @returns {Promise} Promise with wishlist data
 */
export const getWishlist = async () => {
  const response = await api.get(WISHLIST_ENDPOINTS.ALL);
  return response.data;
};

/**
 * Add item to wishlist (buyer only)
 * @param {Object} wishlistData - Wishlist data with contentId
 * @returns {Promise} Promise with added wishlist item
 */
export const addToWishlist = async (wishlistData) => {
  const response = await api.post(WISHLIST_ENDPOINTS.ALL, wishlistData);
  return response.data;
};

/**
 * Remove item from wishlist (buyer only)
 * @param {string} contentId - Content ID
 * @returns {Promise} Promise with success message
 */
export const removeFromWishlist = async (contentId) => {
  const response = await api.delete(WISHLIST_ENDPOINTS.REMOVE(contentId));
  return response.data;
};

/**
 * Check if item is in wishlist (buyer only)
 * @param {string} contentId - Content ID
 * @returns {Promise} Promise with check result
 */
export const checkWishlistItem = async (contentId) => {
  const response = await api.get(WISHLIST_ENDPOINTS.CHECK(contentId));
  return response.data;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistItem,
};
