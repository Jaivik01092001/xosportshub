const ErrorResponse = require('../utils/errorResponse');
const Bid = require('../models/Bid');
const Content = require('../models/Content');
const { validationResult } = require('express-validator');

// @desc    Get all bids
// @route   GET /api/bids
// @access  Private/Admin
exports.getBids = async (req, res, next) => {
  try {
    const bids = await Bid.find()
      .populate({
        path: 'bidder',
        select: 'firstName lastName email'
      })
      .populate('content');

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single bid
// @route   GET /api/bids/:id
// @access  Private
exports.getBid = async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate({
        path: 'bidder',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'content',
        populate: {
          path: 'seller',
          select: 'firstName lastName email'
        }
      });

    if (!bid) {
      return next(
        new ErrorResponse(`Bid not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is bid owner or content seller or admin
    if (
      bid.bidder._id.toString() !== req.user.id &&
      bid.content.seller._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this bid`,
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      data: bid
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new bid
// @route   POST /api/bids
// @access  Private/Buyer
exports.createBid = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { contentId, amount, isAutoBid, maxAutoBidAmount } = req.body;

    // Check if user is a buyer
    if (req.user.role !== 'buyer') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to create a bid`, 403)
      );
    }

    // Get content
    const content = await Content.findById(contentId);
    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${contentId}`, 404)
      );
    }

    // Check if content is published
    if (content.status !== 'Published') {
      return next(
        new ErrorResponse(`Content is not available for bidding`, 400)
      );
    }

    // Check if content allows auction
    if (content.saleType !== 'Auction' && content.saleType !== 'Both') {
      return next(
        new ErrorResponse(`Content does not allow auction`, 400)
      );
    }

    // Check if auction has ended
    if (content.auctionDetails.endTime && new Date(content.auctionDetails.endTime) < new Date()) {
      return next(
        new ErrorResponse(`Auction has ended`, 400)
      );
    }

    // Check if bid amount is greater than starting bid
    if (amount < content.auctionDetails.startingBid) {
      return next(
        new ErrorResponse(`Bid amount must be greater than starting bid`, 400)
      );
    }

    // Get highest bid
    const highestBid = await Bid.findOne({ content: contentId, status: 'Active' })
      .sort('-amount');

    // Check if bid amount is greater than highest bid + minimum increment
    if (highestBid && amount < highestBid.amount + content.auctionDetails.minIncrement) {
      return next(
        new ErrorResponse(`Bid amount must be at least ${highestBid.amount + content.auctionDetails.minIncrement}`, 400)
      );
    }

    // Check if user already has an active bid
    const existingBid = await Bid.findOne({
      content: contentId,
      bidder: req.user.id,
      status: 'Active'
    });

    if (existingBid) {
      // Update existing bid
      existingBid.amount = amount;
      existingBid.isAutoBid = isAutoBid || false;
      existingBid.maxAutoBidAmount = maxAutoBidAmount || amount;
      await existingBid.save();

      // If there was a highest bid, update its status
      if (highestBid && highestBid._id.toString() !== existingBid._id.toString()) {
        highestBid.status = 'Outbid';
        await highestBid.save();
      }

      res.status(200).json({
        success: true,
        data: existingBid
      });
    } else {
      // Create new bid
      const bid = await Bid.create({
        content: contentId,
        bidder: req.user.id,
        amount,
        isAutoBid: isAutoBid || false,
        maxAutoBidAmount: maxAutoBidAmount || amount,
        status: 'Active'
      });

      // If there was a highest bid, update its status
      if (highestBid) {
        highestBid.status = 'Outbid';
        await highestBid.save();
      }

      res.status(201).json({
        success: true,
        data: bid
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel bid
// @route   PUT /api/bids/:id/cancel
// @access  Private/Buyer
exports.cancelBid = async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return next(
        new ErrorResponse(`Bid not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is bid owner
    if (bid.bidder.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to cancel this bid`,
          403
        )
      );
    }

    // Check if bid is active
    if (bid.status !== 'Active') {
      return next(
        new ErrorResponse(`Only active bids can be cancelled`, 400)
      );
    }

    // Update bid status
    bid.status = 'Cancelled';
    await bid.save();

    res.status(200).json({
      success: true,
      data: bid
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bids for content
// @route   GET /api/bids/content/:contentId
// @access  Public
exports.getContentBids = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.contentId);
    
    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.contentId}`, 404)
      );
    }

    const bids = await Bid.find({ content: req.params.contentId })
      .populate({
        path: 'bidder',
        select: 'firstName lastName'
      })
      .sort('-amount');

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user bids
// @route   GET /api/bids/user
// @access  Private
exports.getUserBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ bidder: req.user.id })
      .populate('content')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (err) {
    next(err);
  }
};

// @desc    End auction
// @route   PUT /api/bids/end-auction/:contentId
// @access  Private/Seller/Admin
exports.endAuction = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.contentId);
    
    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.contentId}`, 404)
      );
    }

    // Make sure user is content seller or admin
    if (content.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to end this auction`,
          403
        )
      );
    }

    // Check if content allows auction
    if (content.saleType !== 'Auction' && content.saleType !== 'Both') {
      return next(
        new ErrorResponse(`Content does not allow auction`, 400)
      );
    }

    // Get highest bid
    const highestBid = await Bid.findOne({ content: req.params.contentId, status: 'Active' })
      .sort('-amount');

    // Check if there is a highest bid
    if (!highestBid) {
      return next(
        new ErrorResponse(`No active bids found for this content`, 400)
      );
    }

    // Check if bid meets reserve price
    if (content.auctionDetails.reservePrice && highestBid.amount < content.auctionDetails.reservePrice) {
      // Update all bids to Lost
      await Bid.updateMany(
        { content: req.params.contentId, status: 'Active' },
        { status: 'Lost' }
      );

      return res.status(200).json({
        success: true,
        message: 'Auction ended but reserve price not met',
        data: null
      });
    }

    // Update highest bid to Won
    highestBid.status = 'Won';
    await highestBid.save();

    // Update all other bids to Lost
    await Bid.updateMany(
      { content: req.params.contentId, status: 'Active', _id: { $ne: highestBid._id } },
      { status: 'Lost' }
    );

    // Update content auction end time
    content.auctionDetails.endTime = Date.now();
    await content.save();

    res.status(200).json({
      success: true,
      message: 'Auction ended successfully',
      data: highestBid
    });
  } catch (err) {
    next(err);
  }
};
