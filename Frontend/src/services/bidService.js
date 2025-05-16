import api from './api';
import { BID_ENDPOINTS } from '../utils/constants';

/**
 * Get all bids (admin only)
 * @returns {Promise} Promise with bids data
 */
export const getAllBids = async () => {
  const response = await api.get(BID_ENDPOINTS.ALL);
  return response.data;
};

/**
 * Get single bid
 * @param {string} id - Bid ID
 * @returns {Promise} Promise with bid data
 */
export const getBid = async (id) => {
  const response = await api.get(BID_ENDPOINTS.SINGLE(id));
  return response.data;
};

/**
 * Create bid (buyer only)
 * @param {Object} bidData - Bid data
 * @returns {Promise} Promise with created bid data
 */
export const createBid = async (bidData) => {
  const response = await api.post(BID_ENDPOINTS.ALL, bidData);
  return response.data;
};

/**
 * Cancel bid (buyer only)
 * @param {string} id - Bid ID
 * @returns {Promise} Promise with success message
 */
export const cancelBid = async (id) => {
  const response = await api.put(BID_ENDPOINTS.CANCEL(id));
  return response.data;
};

/**
 * Get bids for content
 * @param {string} contentId - Content ID
 * @returns {Promise} Promise with content bids data
 */
export const getContentBids = async (contentId) => {
  const response = await api.get(BID_ENDPOINTS.CONTENT_BIDS(contentId));
  return response.data;
};

/**
 * Get user bids
 * @returns {Promise} Promise with user bids data
 */
export const getUserBids = async () => {
  const response = await api.get(BID_ENDPOINTS.USER_BIDS);
  return response.data;
};

/**
 * End auction (seller only)
 * @param {string} contentId - Content ID
 * @returns {Promise} Promise with success message
 */
export const endAuction = async (contentId) => {
  const response = await api.put(BID_ENDPOINTS.END_AUCTION(contentId));
  return response.data;
};

export default {
  getAllBids,
  getBid,
  createBid,
  cancelBid,
  getContentBids,
  getUserBids,
  endAuction,
};
