const express = require('express');
const { check } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  getBuyerOrders,
  getSellerOrders,
  downloadContent
} = require('../controllers/orders');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

// Buyer routes
router.get('/buyer', authorize('buyer', 'admin'), getBuyerOrders);
router.get('/:id/download', authorize('buyer', 'admin'), downloadContent);

// Seller routes
router.get('/seller', authorize('seller', 'admin'), getSellerOrders);

// Admin routes
router.get('/', authorize('admin'), getOrders);
router.put('/:id', authorize('admin'), updateOrder);

// Common routes
router.get('/:id', getOrder);

router.post(
  '/',
  authorize('buyer', 'admin'),
  [
    check('contentId', 'Content ID is required').not().isEmpty(),
    check('orderType', 'Order type is required').isIn(['Fixed', 'Auction', 'Custom'])
  ],
  createOrder
);

module.exports = router;
