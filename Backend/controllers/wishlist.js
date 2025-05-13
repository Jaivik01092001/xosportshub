const ErrorResponse = require("../utils/errorResponse");
const Wishlist = require("../models/Wishlist");
const Content = require("../models/Content");
const { validationResult } = require("express-validator");

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private/Buyer
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate({
        path: "content",
        select: "title description sport contentType price thumbnailUrl seller",
        populate: {
          path: "seller",
          select: "firstName lastName profileImage isVerified",
        },
      })
      .sort("-addedAt");

    res.status(200).json({
      success: true,
      count: wishlist.length,
      data: wishlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add content to wishlist
// @route   POST /api/wishlist
// @access  Private/Buyer
exports.addToWishlist = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { contentId, notes } = req.body;

    // Check if content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${contentId}`, 404)
      );
    }

    // Check if content is published
    if (content.status !== "Published" || content.visibility !== "Public") {
      return next(
        new ErrorResponse(`Content is not available for wishlist`, 400)
      );
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      user: req.user.id,
      content: contentId,
    });

    if (existingItem) {
      return next(new ErrorResponse(`Content already in wishlist`, 400));
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      content: contentId,
      notes,
    });

    // Populate content details
    await wishlistItem.populate({
      path: "content",
      select: "title description sport contentType price thumbnailUrl seller",
      populate: {
        path: "seller",
        select: "firstName lastName profileImage isVerified",
      },
    });

    res.status(201).json({
      success: true,
      data: wishlistItem,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove content from wishlist
// @route   DELETE /api/wishlist/:contentId
// @access  Private/Buyer
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user.id,
      content: req.params.contentId,
    });

    if (!wishlistItem) {
      return next(new ErrorResponse(`Item not found in wishlist`, 404));
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check if content is in wishlist
// @route   GET /api/wishlist/check/:contentId
// @access  Private/Buyer
exports.checkWishlistItem = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      content: req.params.contentId,
    });

    res.status(200).json({
      success: true,
      data: {
        inWishlist: !!wishlistItem,
        item: wishlistItem,
      },
    });
  } catch (err) {
    next(err);
  }
};
