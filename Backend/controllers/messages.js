const ErrorResponse = require('../utils/errorResponse');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
      isArchived: false
    })
      .populate({
        path: 'participants',
        select: 'firstName lastName profileImage'
      })
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt'
      })
      .sort('-updatedAt');

    // Format conversations for the client
    const formattedConversations = conversations.map(conversation => {
      // Get the other participant (not the current user)
      const otherParticipants = conversation.participants.filter(
        participant => participant._id.toString() !== req.user.id
      );

      // Check if the last message is read by the current user
      let isUnread = false;
      if (conversation.lastMessage) {
        const lastMessage = conversation.lastMessage;
        if (lastMessage.sender.toString() !== req.user.id) {
          // Check if the message has been read by the current user
          const readByUser = lastMessage.readBy && lastMessage.readBy.some(
            read => read.user.toString() === req.user.id
          );
          isUnread = !readByUser;
        }
      }

      return {
        _id: conversation._id,
        subject: conversation.subject,
        participants: otherParticipants,
        lastMessage: conversation.lastMessage,
        isUnread,
        updatedAt: conversation.updatedAt,
        createdAt: conversation.createdAt
      };
    });

    res.status(200).json({
      success: true,
      count: formattedConversations.length,
      data: formattedConversations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single conversation
// @route   GET /api/messages/conversations/:id
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate({
        path: 'participants',
        select: 'firstName lastName profileImage'
      })
      .populate({
        path: 'relatedContent',
        select: 'title'
      })
      .populate({
        path: 'relatedRequest',
        select: 'title'
      });

    if (!conversation) {
      return next(
        new ErrorResponse(`Conversation not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if user is a participant
    if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
      return next(
        new ErrorResponse(`Not authorized to access this conversation`, 403)
      );
    }

    // Get messages for this conversation
    const messages = await Message.find({ conversation: req.params.id })
      .populate({
        path: 'sender',
        select: 'firstName lastName profileImage'
      })
      .sort('createdAt');

    // Mark all messages as read by this user
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user.id },
        'readBy.user': { $ne: req.user.id }
      },
      {
        $addToSet: {
          readBy: { user: req.user.id, readAt: Date.now() }
        }
      }
    );

    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new conversation
// @route   POST /api/messages/conversations
// @access  Private
exports.createConversation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { recipient, subject, message, relatedContent, relatedRequest } = req.body;

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return next(
        new ErrorResponse(`User not found with id of ${recipient}`, 404)
      );
    }

    // Create conversation
    const conversation = await Conversation.create({
      participants: [req.user.id, recipient],
      subject,
      relatedContent,
      relatedRequest
    });

    // Create first message
    const newMessage = await Message.create({
      sender: req.user.id,
      conversation: conversation._id,
      content: message
    });

    // Update conversation with lastMessage
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(201).json({
      success: true,
      data: {
        conversation,
        message: newMessage
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversations/:conversationId/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return next(
        new ErrorResponse(`Conversation not found with id of ${req.params.conversationId}`, 404)
      );
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Not authorized to access this conversation`, 403)
      );
    }

    // Get messages
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate({
        path: 'sender',
        select: 'firstName lastName profileImage'
      })
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send message to conversation
// @route   POST /api/messages/conversations/:conversationId/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return next(
        new ErrorResponse(`Conversation not found with id of ${req.params.conversationId}`, 404)
      );
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Not authorized to access this conversation`, 403)
      );
    }

    // Create message
    const message = await Message.create({
      sender: req.user.id,
      conversation: req.params.conversationId,
      content: req.body.content,
      attachments: req.body.attachments
    });

    // Populate sender info
    await message.populate({
      path: 'sender',
      select: 'firstName lastName profileImage'
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark conversation as read
// @route   PUT /api/messages/conversations/:conversationId/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return next(
        new ErrorResponse(`Conversation not found with id of ${req.params.conversationId}`, 404)
      );
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Not authorized to access this conversation`, 403)
      );
    }

    // Mark all messages as read by this user
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user.id },
        'readBy.user': { $ne: req.user.id }
      },
      {
        $addToSet: {
          readBy: { user: req.user.id, readAt: Date.now() }
        }
      }
    );

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Archive conversation
// @route   PUT /api/messages/conversations/:id/archive
// @access  Private
exports.archiveConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return next(
        new ErrorResponse(`Conversation not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Not authorized to access this conversation`, 403)
      );
    }

    // Archive conversation
    conversation.isArchived = true;
    await conversation.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: req.user.id,
      isArchived: false
    });

    const conversationIds = conversations.map(c => c._id);

    // Count unread messages
    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user.id },
      'readBy.user': { $ne: req.user.id }
    });

    res.status(200).json({
      success: true,
      data: { count: unreadCount }
    });
  } catch (err) {
    next(err);
  }
};
