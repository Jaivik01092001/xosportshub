import api from './api';
import { CONTENT_ENDPOINTS } from '../utils/constants';

/**
 * Get all content
 * @param {Object} params - Query parameters for filtering, pagination, etc.
 * @returns {Promise} Promise with content data
 */
export const getAllContent = async (params = {}) => {
  const response = await api.get(CONTENT_ENDPOINTS.ALL, { params });
  return response.data;
};

/**
 * Get content categories
 * @returns {Promise} Promise with categories data
 */
export const getContentCategories = async () => {
  const response = await api.get(CONTENT_ENDPOINTS.CATEGORIES);
  return response.data;
};

/**
 * Get trending content
 * @returns {Promise} Promise with trending content data
 */
export const getTrendingContent = async () => {
  const response = await api.get(CONTENT_ENDPOINTS.TRENDING);
  return response.data;
};

/**
 * Get single content by ID
 * @param {string} id - Content ID
 * @returns {Promise} Promise with content data
 */
export const getContent = async (id) => {
  const response = await api.get(CONTENT_ENDPOINTS.SINGLE(id));
  return response.data;
};

/**
 * Create content (seller only)
 * @param {Object} contentData - Content data
 * @returns {Promise} Promise with created content data
 */
export const createContent = async (contentData) => {
  const response = await api.post(CONTENT_ENDPOINTS.ALL, contentData);
  return response.data;
};

/**
 * Update content (seller only)
 * @param {string} id - Content ID
 * @param {Object} contentData - Content data to update
 * @returns {Promise} Promise with updated content data
 */
export const updateContent = async (id, contentData) => {
  const response = await api.put(CONTENT_ENDPOINTS.SINGLE(id), contentData);
  return response.data;
};

/**
 * Delete content (seller only)
 * @param {string} id - Content ID
 * @returns {Promise} Promise with success message
 */
export const deleteContent = async (id) => {
  const response = await api.delete(CONTENT_ENDPOINTS.SINGLE(id));
  return response.data;
};

/**
 * Get seller content (seller only)
 * @returns {Promise} Promise with seller content data
 */
export const getSellerContent = async () => {
  const response = await api.get(CONTENT_ENDPOINTS.SELLER_CONTENT);
  return response.data;
};

/**
 * Upload content file (seller only)
 * @param {FormData} formData - Form data with file
 * @returns {Promise} Promise with upload result
 */
export const uploadContentFile = async (formData) => {
  const response = await api.post(CONTENT_ENDPOINTS.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default {
  getAllContent,
  getContentCategories,
  getTrendingContent,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  getSellerContent,
  uploadContentFile,
};
