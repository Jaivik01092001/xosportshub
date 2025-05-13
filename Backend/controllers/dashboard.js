const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Content = require('../models/Content');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const CustomRequest = require('../models/CustomRequest');
const Bid = require('../models/Bid');

// @desc    Get all dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get user counts
    const totalUsers = await User.countDocuments();
    const buyerCount = await User.countDocuments({ role: 'buyer' });
    const sellerCount = await User.countDocuments({ role: 'seller' });
    const pendingSellerVerifications = await User.countDocuments({ 
      role: 'seller', 
      isVerified: false 
    });
    
    // Get content counts
    const totalContent = await Content.countDocuments();
    const publishedContent = await Content.countDocuments({ status: 'Published' });
    const draftContent = await Content.countDocuments({ status: 'Draft' });
    
    // Get order and revenue stats
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    
    // Get revenue stats
    const revenueStats = await Payment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          platformFees: { $sum: '$platformFee' },
          sellerEarnings: { $sum: '$sellerEarnings' }
        }
      }
    ]);

    // Get custom request stats
    const totalRequests = await CustomRequest.countDocuments();
    const pendingRequests = await CustomRequest.countDocuments({ status: 'Pending' });
    
    // Get auction stats
    const activeAuctions = await Content.countDocuments({ 
      saleType: { $in: ['Auction', 'Both'] },
      status: 'Published',
      'auctionDetails.endTime': { $gt: new Date() }
    });
    
    // Get recent activity
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('buyer', 'firstName lastName')
      .populate('seller', 'firstName lastName')
      .populate('content', 'title');
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          buyers: buyerCount,
          sellers: sellerCount,
          pendingVerifications: pendingSellerVerifications
        },
        content: {
          total: totalContent,
          published: publishedContent,
          draft: draftContent
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders
        },
        revenue: revenueStats[0] || { 
          totalRevenue: 0, 
          platformFees: 0, 
          sellerEarnings: 0 
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests
        },
        auctions: {
          active: activeAuctions
        },
        recentActivity: recentOrders
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user statistics
// @route   GET /api/dashboard/users
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
  try {
    // Get user counts by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get new users per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const newUsersPerMonth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' }, 
            year: { $year: '$createdAt' } 
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Get top sellers by content count
    const topSellers = await Content.aggregate([
      {
        $group: {
          _id: '$seller',
          contentCount: { $sum: 1 }
        }
      },
      {
        $sort: { contentCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      {
        $project: {
          _id: 1,
          contentCount: 1,
          'sellerInfo.firstName': 1,
          'sellerInfo.lastName': 1,
          'sellerInfo.email': 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        usersByRole,
        newUsersPerMonth,
        topSellers
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get content statistics
// @route   GET /api/dashboard/content
// @access  Private/Admin
exports.getContentStats = async (req, res, next) => {
  try {
    // Get content by type
    const contentByType = await Content.aggregate([
      {
        $group: {
          _id: '$contentType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get content by sport
    const contentBySport = await Content.aggregate([
      {
        $group: {
          _id: '$sport',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get content by difficulty
    const contentByDifficulty = await Content.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get top rated content
    const topRatedContent = await Content.find()
      .where('averageRating').exists(true)
      .sort('-averageRating')
      .limit(5)
      .populate('seller', 'firstName lastName');
    
    // Get most purchased content
    const mostPurchasedContent = await Order.aggregate([
      {
        $group: {
          _id: '$content',
          purchaseCount: { $sum: 1 }
        }
      },
      {
        $sort: { purchaseCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'contents',
          localField: '_id',
          foreignField: '_id',
          as: 'contentInfo'
        }
      },
      {
        $project: {
          _id: 1,
          purchaseCount: 1,
          'contentInfo.title': 1,
          'contentInfo.sport': 1,
          'contentInfo.contentType': 1,
          'contentInfo.seller': 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        contentByType,
        contentBySport,
        contentByDifficulty,
        topRatedContent,
        mostPurchasedContent
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order statistics
// @route   GET /api/dashboard/orders
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
  try {
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get orders by type
    const ordersByType = await Order.aggregate([
      {
        $group: {
          _id: '$orderType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get orders per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const ordersPerMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' }, 
            year: { $year: '$createdAt' } 
          },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        ordersByStatus,
        ordersByType,
        ordersPerMonth
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get revenue statistics
// @route   GET /api/dashboard/revenue
// @access  Private/Admin
exports.getRevenueStats = async (req, res, next) => {
  try {
    // Get revenue per month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const revenuePerMonth = await Payment.aggregate([
      {
        $match: {
          status: 'Completed',
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' }, 
            year: { $year: '$createdAt' } 
          },
          totalRevenue: { $sum: '$amount' },
          platformFees: { $sum: '$platformFee' },
          sellerEarnings: { $sum: '$sellerEarnings' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Get revenue by content type
    const revenueByContentType = await Payment.aggregate([
      {
        $match: {
          status: 'Completed'
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'order',
          foreignField: '_id',
          as: 'orderInfo'
        }
      },
      {
        $unwind: '$orderInfo'
      },
      {
        $lookup: {
          from: 'contents',
          localField: 'orderInfo.content',
          foreignField: '_id',
          as: 'contentInfo'
        }
      },
      {
        $unwind: '$contentInfo'
      },
      {
        $group: {
          _id: '$contentInfo.contentType',
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get pending payouts
    const pendingPayouts = await Payment.aggregate([
      {
        $match: {
          status: 'Completed',
          payoutStatus: 'Pending'
        }
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: '$sellerEarnings' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        revenuePerMonth,
        revenueByContentType,
        pendingPayouts: pendingPayouts[0] || { totalPending: 0, count: 0 }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private/Admin
exports.getRecentActivity = async (req, res, next) => {
  try {
    // Get recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('buyer', 'firstName lastName')
      .populate('seller', 'firstName lastName')
      .populate('content', 'title');
    
    // Get recent users
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(10)
      .select('firstName lastName email role createdAt');
    
    // Get recent content
    const recentContent = await Content.find()
      .sort('-createdAt')
      .limit(10)
      .populate('seller', 'firstName lastName');
    
    // Get recent custom requests
    const recentRequests = await CustomRequest.find()
      .sort('-createdAt')
      .limit(10)
      .populate('buyer', 'firstName lastName')
      .populate('seller', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      data: {
        recentOrders,
        recentUsers,
        recentContent,
        recentRequests
      }
    });
  } catch (err) {
    next(err);
  }
};
