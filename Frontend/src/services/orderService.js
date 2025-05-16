import api from './api';
import { ORDER_ENDPOINTS } from '../utils/constants';

/**
 * Get all orders (admin only)
 * @returns {Promise} Promise with orders data
 */
export const getAllOrders = async () => {
  const response = await api.get(ORDER_ENDPOINTS.ALL);
  return response.data;
};

/**
 * Get single order
 * @param {string} id - Order ID
 * @returns {Promise} Promise with order data
 */
export const getOrder = async (id) => {
  const response = await api.get(ORDER_ENDPOINTS.SINGLE(id));
  return response.data;
};

/**
 * Create order (buyer only)
 * @param {Object} orderData - Order data
 * @returns {Promise} Promise with created order data
 */
export const createOrder = async (orderData) => {
  const response = await api.post(ORDER_ENDPOINTS.ALL, orderData);
  return response.data;
};

/**
 * Update order status (admin only)
 * @param {string} id - Order ID
 * @param {Object} statusData - Status data
 * @returns {Promise} Promise with updated order data
 */
export const updateOrderStatus = async (id, statusData) => {
  const response = await api.put(ORDER_ENDPOINTS.SINGLE(id), statusData);
  return response.data;
};

/**
 * Get buyer orders (buyer only)
 * @returns {Promise} Promise with buyer orders data
 */
export const getBuyerOrders = async () => {
  const response = await api.get(ORDER_ENDPOINTS.BUYER_ORDERS);
  return response.data;
};

/**
 * Get seller orders (seller only)
 * @returns {Promise} Promise with seller orders data
 */
export const getSellerOrders = async () => {
  const response = await api.get(ORDER_ENDPOINTS.SELLER_ORDERS);
  return response.data;
};

/**
 * Download content (buyer only)
 * @param {string} id - Order ID
 * @returns {Promise} Promise with download URL
 */
export const downloadContent = async (id) => {
  const response = await api.get(ORDER_ENDPOINTS.DOWNLOAD(id), {
    responseType: 'blob',
  });
  return response.data;
};

export default {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getBuyerOrders,
  getSellerOrders,
  downloadContent,
};
