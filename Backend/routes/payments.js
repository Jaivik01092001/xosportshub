const express = require('express');
const { check } = require('express-validator');
const {
  getPayments,
  getPayment,
  createPaymentIntent,
  confirmPayment,
  webhook,
  getBuyerPayments,
  getSellerPayments,
  processPayout
} = require('../controllers/payments');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

// Protected routes
router.use(protect);

// Buyer routes
router.get('/buyer', authorize('buyer', 'admin'), getBuyerPayments);

router.post(
  '/create-intent',
  authorize('buyer', 'admin'),
  [
    check('orderId', 'Order ID is required').not().isEmpty()
  ],
  createPaymentIntent
);

router.post(
  '/confirm',
  authorize('buyer', 'admin'),
  [
    check('paymentIntentId', 'Payment intent ID is required').not().isEmpty(),
    check('orderId', 'Order ID is required').not().isEmpty()
  ],
  confirmPayment
);

// Seller routes
router.get('/seller', authorize('seller', 'admin'), getSellerPayments);

// Admin routes
router.get('/', authorize('admin'), getPayments);
router.post('/:id/payout', authorize('admin'), processPayout);

// Common routes
router.get('/:id', getPayment);

module.exports = router;
