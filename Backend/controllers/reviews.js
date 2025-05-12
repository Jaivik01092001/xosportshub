const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Content = require('../models/Content');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'user',
        select: 'firstName lastName'
      })
      .populate({
        path: 'content',
        select: 'title sport contentType'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'firstName lastName'
      })
      .populate({
        path: 'content',
        select: 'title sport contentType seller'
      });

    if (!review) {
      return next(
        new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a content
// @route   GET /api/reviews/content/:contentId
// @access  Public
exports.getContentReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ content: req.params.contentId })
      .populate({
        path: 'user',
        select: 'firstName lastName'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
exports.getSellerReviews = async (req, res, next) => {
  try {
    // Find all content by this seller
    const sellerContent = await Content.find({ seller: req.params.sellerId }).select('_id');
    
    // Get content IDs
    const contentIds = sellerContent.map(content => content._id);
    
    // Find all reviews for this content
    const reviews = await Review.find({ content: { $in: contentIds } })
      .populate({
        path: 'user',
        select: 'firstName lastName'
      })
      .populate({
        path: 'content',
        select: 'title sport contentType'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private/Buyer
exports.createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    // Check if content exists
    const content = await Content.findById(req.body.content);
    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.body.content}`, 404)
      );
    }

    // Check if user has purchased this content
    const order = await Order.findOne({
      buyer: req.user.id,
      content: req.body.content,
      status: 'Completed'
    });

    if (!order) {
      return next(
        new ErrorResponse(
          `You can only review content that you have purchased`,
          403
        )
      );
    }

    // Check if user already reviewed this content
    const existingReview = await Review.findOne({
      user: req.user.id,
      content: req.body.content
    });

    if (existingReview) {
      return next(
        new ErrorResponse(
          `You have already reviewed this content`,
          400
        )
      );
    }

    // Create review
    const review = await Review.create({
      ...req.body,
      isVerifiedPurchase: true,
      orderId: order._id
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Buyer
exports.updateReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this review`,
          403
        )
      );
    }

    // Update review
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Buyer/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this review`,
          403
        )
      );
    }

    await review.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
