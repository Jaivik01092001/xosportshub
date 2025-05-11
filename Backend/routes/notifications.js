const express = require('express');
const { check } = require('express-validator');
const {
  getNotifications,
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notifications');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.get('/me', getUserNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.get('/', authorize('admin'), getNotifications);

router.post(
  '/',
  authorize('admin'),
  [
    check('user', 'User ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty(),
    check('type', 'Type is required').isIn([
      'order',
      'bid',
      'custom_request',
      'payment',
      'account',
      'system'
    ])
  ],
  createNotification
);

module.exports = router;
