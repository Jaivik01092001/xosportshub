const express = require('express');
const { check } = require('express-validator');
const {
  getRequests,
  getRequest,
  createRequest,
  respondToRequest,
  cancelRequest,
  submitContent,
  getBuyerRequests,
  getSellerRequests
} = require('../controllers/requests');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

// Buyer routes
router.get('/buyer', authorize('buyer', 'admin'), getBuyerRequests);
router.put('/:id/cancel', authorize('buyer', 'admin'), cancelRequest);

router.post(
  '/',
  authorize('buyer'),
  [
    check('sellerId', 'Seller ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('sport', 'Sport is required').not().isEmpty(),
    check('contentType', 'Content type is required').not().isEmpty(),
    check('budget', 'Budget is required and must be a positive number').isFloat({ min: 0.01 })
  ],
  createRequest
);

// Seller routes
router.get('/seller', authorize('seller', 'admin'), getSellerRequests);

router.put(
  '/:id/respond',
  authorize('seller'),
  [
    check('accepted', 'Accepted status is required').isBoolean(),
    check('price', 'Price must be a positive number').optional().isFloat({ min: 0.01 }),
    check('message', 'Message is required').not().isEmpty()
  ],
  respondToRequest
);

router.post(
  '/:id/submit',
  authorize('seller'),
  [
    check('fileUrl', 'File URL is required').not().isEmpty()
  ],
  submitContent
);

// Admin routes
router.get('/', authorize('admin'), getRequests);

// Common routes
router.get('/:id', getRequest);

module.exports = router;
