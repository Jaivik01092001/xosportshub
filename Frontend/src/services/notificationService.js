import api from './api';
import { NOTIFICATION_ENDPOINTS } from '../utils/constants';

/**
 * Get all notifications (admin only)
 * @returns {Promise} Promise with notifications data
 */
export const getAllNotifications = async () => {
  const response = await api.get(NOTIFICATION_ENDPOINTS.ALL);
  return response.data;
};

/**
 * Get user notifications
 * @returns {Promise} Promise with user notifications data
 */
export const getUserNotifications = async () => {
  const response = await api.get(NOTIFICATION_ENDPOINTS.USER_NOTIFICATIONS);
  return response.data;
};

/**
 * Create notification (admin only)
 * @param {Object} notificationData - Notification data
 * @returns {Promise} Promise with created notification data
 */
export const createNotification = async (notificationData) => {
  const response = await api.post(NOTIFICATION_ENDPOINTS.ALL, notificationData);
  return response.data;
};

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 * @returns {Promise} Promise with updated notification data
 */
export const markAsRead = async (id) => {
  const response = await api.put(NOTIFICATION_ENDPOINTS.READ(id));
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise} Promise with success message
 */
export const markAllAsRead = async () => {
  const response = await api.put(NOTIFICATION_ENDPOINTS.READ_ALL);
  return response.data;
};

/**
 * Delete notification
 * @param {string} id - Notification ID
 * @returns {Promise} Promise with success message
 */
export const deleteNotification = async (id) => {
  const response = await api.delete(`${NOTIFICATION_ENDPOINTS.ALL}/${id}`);
  return response.data;
};

/**
 * Get unread notification count
 * @returns {Promise} Promise with unread count
 */
export const getUnreadCount = async () => {
  const response = await api.get(NOTIFICATION_ENDPOINTS.UNREAD_COUNT);
  return response.data;
};

export default {
  getAllNotifications,
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
