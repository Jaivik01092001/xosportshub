import api from './api';
import { PAYMENT_ENDPOINTS } from '../utils/constants';

/**
 * Get all payments (admin only)
 * @returns {Promise} Promise with payments data
 */
export const getAllPayments = async () => {
  const response = await api.get(PAYMENT_ENDPOINTS.ALL);
  return response.data;
};

/**
 * Get single payment
 * @param {string} id - Payment ID
 * @returns {Promise} Promise with payment data
 */
export const getPayment = async (id) => {
  const response = await api.get(PAYMENT_ENDPOINTS.SINGLE(id));
  return response.data;
};

/**
 * Create payment intent (buyer only)
 * @param {Object} paymentData - Payment data
 * @returns {Promise} Promise with payment intent data
 */
export const createPaymentIntent = async (paymentData) => {
  const response = await api.post(PAYMENT_ENDPOINTS.CREATE_INTENT, paymentData);
  return response.data;
};

/**
 * Confirm payment (buyer only)
 * @param {Object} confirmData - Confirmation data
 * @returns {Promise} Promise with confirmation result
 */
export const confirmPayment = async (confirmData) => {
  const response = await api.post(PAYMENT_ENDPOINTS.CONFIRM, confirmData);
  return response.data;
};

/**
 * Get buyer payments (buyer only)
 * @returns {Promise} Promise with buyer payments data
 */
export const getBuyerPayments = async () => {
  const response = await api.get(PAYMENT_ENDPOINTS.BUYER_PAYMENTS);
  return response.data;
};

/**
 * Get seller payments (seller only)
 * @returns {Promise} Promise with seller payments data
 */
export const getSellerPayments = async () => {
  const response = await api.get(PAYMENT_ENDPOINTS.SELLER_PAYMENTS);
  return response.data;
};

/**
 * Process payout (admin only)
 * @param {string} id - Payment ID
 * @returns {Promise} Promise with payout result
 */
export const processPayout = async (id) => {
  const response = await api.post(PAYMENT_ENDPOINTS.PAYOUT(id));
  return response.data;
};

export default {
  getAllPayments,
  getPayment,
  createPaymentIntent,
  confirmPayment,
  getBuyerPayments,
  getSellerPayments,
  processPayout,
};
