const ErrorResponse = require("../utils/errorResponse");
const Content = require("../models/Content");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// @desc    Get all content
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = [
      "select",
      "sort",
      "page",
      "limit",
      "search",
      "price_range",
      "rating",
    ];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Parse the query string
    let queryObj = JSON.parse(queryStr);

    // Base query - only published and public content
    const baseQuery = {
      status: "Published",
      visibility: "Public",
      ...queryObj,
    };

    // Handle search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      baseQuery.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Handle price range
    if (req.query.price_range) {
      const [min, max] = req.query.price_range.split(",").map(Number);
      if (!isNaN(min)) {
        baseQuery.price = { ...baseQuery.price, $gte: min };
      }
      if (!isNaN(max)) {
        baseQuery.price = { ...baseQuery.price, $lte: max };
      }
    }

    // Handle rating filter
    if (req.query.rating) {
      const minRating = parseFloat(req.query.rating);
      if (!isNaN(minRating)) {
        baseQuery.averageRating = { $gte: minRating };
      }
    }

    // Finding resource
    query = Content.find(baseQuery);

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Count total before pagination
    const total = await Content.countDocuments(baseQuery);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    query = query.skip(startIndex).limit(limit);

    // Populate
    query = query.populate({
      path: "seller",
      select: "firstName lastName profileImage isVerified",
    });

    // Executing query
    const content = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: content.length,
      total,
      pagination,
      data: content,
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
      path: "seller",
      select: "firstName lastName profileImage isVerified",
    });

    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if content is published or user is the seller or admin
    if (
      content.status !== "Published" &&
      (!req.user ||
        (req.user.id !== content.seller._id.toString() &&
          req.user.role !== "admin"))
    ) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: content,
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
    if (user.role !== "seller") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to create content`,
          403
        )
      );
    }

    const content = await Content.create(req.body);

    res.status(201).json({
      success: true,
      data: content,
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
    if (
      content.seller.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this content`,
          403
        )
      );
    }

    content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: content,
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
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return next(
        new ErrorResponse(`Content not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is content seller
    if (
      content.seller.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this content`,
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller content
// @route   GET /api/content/seller/me
// @access  Private/Seller
exports.getSellerContent = async (req, res, next) => {
  try {
    const content = await Content.find({ seller: req.user.id });

    res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get content categories
// @route   GET /api/content/categories
// @access  Public
exports.getContentCategories = async (req, res, next) => {
  try {
    // Get unique sport types
    const sports = await Content.distinct("sport", {
      status: "Published",
      visibility: "Public",
    });

    // Get unique content types
    const contentTypes = await Content.distinct("contentType", {
      status: "Published",
      visibility: "Public",
    });

    // Get unique difficulty levels
    const difficultyLevels = await Content.distinct("difficulty", {
      status: "Published",
      visibility: "Public",
    });

    // Get price ranges
    const priceStats = await Content.aggregate([
      {
        $match: {
          status: "Published",
          visibility: "Public",
          price: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    // Get popular tags
    const tagCounts = await Content.aggregate([
      {
        $match: {
          status: "Published",
          visibility: "Public",
          tags: { $exists: true, $ne: [] },
        },
      },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    const popularTags = tagCounts.map((tag) => tag._id);

    res.status(200).json({
      success: true,
      data: {
        sports,
        contentTypes,
        difficultyLevels,
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 },
        popularTags,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get trending content
// @route   GET /api/content/trending
// @access  Public
exports.getTrendingContent = async (req, res, next) => {
  try {
    // Get content with highest ratings
    const topRated = await Content.find({
      status: "Published",
      visibility: "Public",
      averageRating: { $exists: true, $gte: 4 },
    })
      .sort("-averageRating")
      .limit(5)
      .populate({
        path: "seller",
        select: "firstName lastName profileImage isVerified",
      });

    // Get most recently published content
    const newest = await Content.find({
      status: "Published",
      visibility: "Public",
    })
      .sort("-createdAt")
      .limit(5)
      .populate({
        path: "seller",
        select: "firstName lastName profileImage isVerified",
      });

    // Get most purchased content (would require aggregation with orders)
    // This is a placeholder - you would need to implement the actual query
    const popular = await Content.find({
      status: "Published",
      visibility: "Public",
    })
      .sort("-createdAt")
      .limit(5)
      .populate({
        path: "seller",
        select: "firstName lastName profileImage isVerified",
      });

    res.status(200).json({
      success: true,
      data: {
        topRated,
        newest,
        popular,
      },
    });
  } catch (err) {
    next(err);
  }
};
