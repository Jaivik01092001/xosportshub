const express = require('express');
const { check } = require('express-validator');
const {
  getBids,
  getBid,
  createBid,
  cancelBid,
  getContentBids,
  getUserBids,
  endAuction
} = require('../controllers/bids');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/content/:contentId', getContentBids);

// Protected routes
router.use(protect);

// Buyer routes
router.post(
  '/',
  authorize('buyer'),
  [
    check('contentId', 'Content ID is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 })
  ],
  createBid
);

router.put('/:id/cancel', authorize('buyer', 'admin'), cancelBid);
router.get('/user', getUserBids);

// Seller/Admin routes
router.put('/end-auction/:contentId', authorize('seller', 'admin'), endAuction);

// Admin routes
router.get('/', authorize('admin'), getBids);

// Common routes
router.get('/:id', getBid);

module.exports = router;
