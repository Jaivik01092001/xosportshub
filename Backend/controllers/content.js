const ErrorResponse = require('../utils/errorResponse');
const Content = require('../models/Content');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all content
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Content.find(JSON.parse(queryStr))
      .where('status')
      .equals('Published')
      .where('visibility')
      .equals('Public');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Content.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate
    query = query.populate({
      path: 'seller',
      select: 'firstName lastName profileImage isVerified'
    });

    // Executing query
    const content = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: content.length,
      pagination,
      data: content
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Public
exports.getContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id).populate({
      path: 'seller',
      select: 'firstName lastName profileImage isVerified'
    });

    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if content is published or user is the seller or admin
    if (
      content.status !== 'Published' &&
      (!req.user || (req.user.id !== content.seller._id.toString() && req.user.role !== 'admin'))
    ) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private/Seller
exports.createContent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Add user to req.body
    req.body.seller = req.user.id;

    // Check if user is a seller
    const user = await User.findById(req.user.id);
    if (user.role !== 'seller') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to create content`, 403)
      );
    }

    const content = await Content.create(req.body);

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private/Seller
exports.updateContent = async (req, res, next) => {
  try {
    let content = await Content.findById(req.params.id);

    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is content seller
    if (content.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this content`,
          403
        )
      );
    }

    content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private/Seller
exports.deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is content seller
    if (content.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this content`,
          403
        )
      );
    }

    await content.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller content
// @route   GET /api/content/seller
// @access  Private/Seller
exports.getSellerContent = async (req, res, next) => {
  try {
    const content = await Content.find({ seller: req.user.id });

    res.status(200).json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (err) {
    next(err);
  }
};
