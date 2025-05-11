const ErrorResponse = require('../utils/errorResponse');
const CustomRequest = require('../models/CustomRequest');
const User = require('../models/User');
const Content = require('../models/Content');
const { validationResult } = require('express-validator');

// @desc    Get all custom requests
// @route   GET /api/requests
// @access  Private/Admin
exports.getRequests = async (req, res, next) => {
  try {
    const requests = await CustomRequest.find()
      .populate({
        path: 'buyer',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'seller',
        select: 'firstName lastName email'
      });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single custom request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res, next) => {
  try {
    const request = await CustomRequest.findById(req.params.id)
      .populate({
        path: 'buyer',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'seller',
        select: 'firstName lastName email'
      })
      .populate('contentId')
      .populate('orderId');

    if (!request) {
      return next(
        new ErrorResponse(`Custom request not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is request buyer or seller or admin
    if (
      request.buyer._id.toString() !== req.user.id &&
      request.seller._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this request`,
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new custom request
// @route   POST /api/requests
// @access  Private/Buyer
exports.createRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { sellerId, title, description, sport, contentType, requestedDeliveryDate, budget } = req.body;

    // Check if user is a buyer
    if (req.user.role !== 'buyer') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to create a custom request`, 403)
      );
    }

    // Get seller
    const seller = await User.findById(sellerId);
    if (!seller) {
      return next(
        new ErrorResponse(`Seller not found with id of ${sellerId}`, 404)
      );
    }

    // Check if seller is verified
    if (!seller.isVerified) {
      return next(
        new ErrorResponse(`Seller is not verified`, 400)
      );
    }

    // Create request
    const request = await CustomRequest.create({
      buyer: req.user.id,
      seller: sellerId,
      title,
      description,
      sport,
      contentType,
      requestedDeliveryDate,
      budget,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Respond to custom request
// @route   PUT /api/requests/:id/respond
// @access  Private/Seller
exports.respondToRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { accepted, price, estimatedDeliveryDate, message } = req.body;

    let request = await CustomRequest.findById(req.params.id);

    if (!request) {
      return next(
        new ErrorResponse(`Custom request not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is request seller
    if (request.seller.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to respond to this request`,
          403
        )
      );
    }

    // Check if request is pending
    if (request.status !== 'Pending') {
      return next(
        new ErrorResponse(`Request is not in a pending state`, 400)
      );
    }

    // Update request
    request.sellerResponse = {
      accepted,
      price: price || request.budget,
      estimatedDeliveryDate: estimatedDeliveryDate || request.requestedDeliveryDate,
      message,
      responseDate: Date.now()
    };

    request.status = accepted ? 'Accepted' : 'Rejected';
    await request.save();

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel custom request
// @route   PUT /api/requests/:id/cancel
// @access  Private/Buyer
exports.cancelRequest = async (req, res, next) => {
  try {
    let request = await CustomRequest.findById(req.params.id);

    if (!request) {
      return next(
        new ErrorResponse(`Custom request not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is request buyer
    if (request.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to cancel this request`,
          403
        )
      );
    }

    // Check if request can be cancelled
    if (request.status !== 'Pending' && request.status !== 'Accepted') {
      return next(
        new ErrorResponse(`Request cannot be cancelled in its current state`, 400)
      );
    }

    // Update request
    request.status = 'Cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit content for custom request
// @route   POST /api/requests/:id/submit
// @access  Private/Seller
exports.submitContent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, fileUrl, previewUrl, thumbnailUrl, duration, fileSize } = req.body;

    let request = await CustomRequest.findById(req.params.id);

    if (!request) {
      return next(
        new ErrorResponse(`Custom request not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is request seller
    if (request.seller.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to submit content for this request`,
          403
        )
      );
    }

    // Check if request is accepted
    if (request.status !== 'Accepted') {
      return next(
        new ErrorResponse(`Request is not in an accepted state`, 400)
      );
    }

    // Create content
    const content = await Content.create({
      title: title || request.title,
      description: description || request.description,
      sport: request.sport,
      contentType: request.contentType,
      fileUrl,
      previewUrl,
      thumbnailUrl,
      duration,
      fileSize,
      difficulty: 'Intermediate', // Default value
      saleType: 'Fixed',
      price: request.sellerResponse.price,
      seller: req.user.id,
      status: 'Published',
      isCustomContent: true,
      customRequestId: request._id
    });

    // Update request
    request.contentId = content._id;
    request.status = 'Completed';
    await request.save();

    res.status(201).json({
      success: true,
      data: {
        request,
        content
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get buyer requests
// @route   GET /api/requests/buyer
// @access  Private/Buyer
exports.getBuyerRequests = async (req, res, next) => {
  try {
    const requests = await CustomRequest.find({ buyer: req.user.id })
      .populate({
        path: 'seller',
        select: 'firstName lastName email'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller requests
// @route   GET /api/requests/seller
// @access  Private/Seller
exports.getSellerRequests = async (req, res, next) => {
  try {
    const requests = await CustomRequest.find({ seller: req.user.id })
      .populate({
        path: 'buyer',
        select: 'firstName lastName email'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};
