const express = require('express');
const { check } = require('express-validator');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getContentReviews,
  getSellerReviews
} = require('../controllers/reviews');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/content/:contentId', getContentReviews);
router.get('/seller/:sellerId', getSellerReviews);

// Protected routes
router.use(protect);

// Buyer routes
router.post(
  '/',
  authorize('buyer'),
  [
    check('content', 'Content ID is required').not().isEmpty(),
    check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('title', 'Title is required').not().isEmpty(),
    check('text', 'Review text is required').not().isEmpty()
  ],
  createReview
);

router.route('/:id')
  .put(
    authorize('buyer'),
    [
      check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
      check('title', 'Title is required').optional().not().isEmpty(),
      check('text', 'Review text is required').optional().not().isEmpty()
    ],
    updateReview
  )
  .delete(authorize('buyer', 'admin'), deleteReview);

// Admin routes
router.get('/', authorize('admin'), getReviews);

// Common routes
router.get('/:id', getReview);

module.exports = router;
