const express = require('express');
const { check } = require('express-validator');
const {
  getConversations,
  getConversation,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead,
  archiveConversation,
  getUnreadCount
} = require('../controllers/messages');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Conversation routes
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.post(
  '/conversations',
  [
    check('recipient', 'Recipient ID is required').not().isEmpty(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  createConversation
);
router.put('/conversations/:id/archive', archiveConversation);

// Message routes
router.get('/conversations/:conversationId/messages', getMessages);
router.post(
  '/conversations/:conversationId/messages',
  [
    check('content', 'Message content is required').not().isEmpty()
  ],
  sendMessage
);
router.put('/conversations/:conversationId/read', markAsRead);

// Stats routes
router.get('/unread-count', getUnreadCount);

module.exports = router;
