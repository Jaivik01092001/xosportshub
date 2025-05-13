const express = require('express');
const {
  getDashboardStats,
  getUserStats,
  getContentStats,
  getOrderStats,
  getRevenueStats,
  getRecentActivity
} = require('../controllers/dashboard');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Main dashboard stats
router.get('/stats', getDashboardStats);

// Individual stat endpoints for more detailed data
router.get('/users', getUserStats);
router.get('/content', getContentStats);
router.get('/orders', getOrderStats);
router.get('/revenue', getRevenueStats);
router.get('/activity', getRecentActivity);

module.exports = router;
