const express = require('express');
const { check } = require('express-validator');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistItem
} = require('../controllers/wishlist');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and for buyers only
router.use(protect);
router.use(authorize('buyer'));

router.route('/')
  .get(getWishlist)
  .post(
    [
      check('contentId', 'Content ID is required').not().isEmpty()
    ],
    addToWishlist
  );

router.delete('/:contentId', removeFromWishlist);
router.get('/check/:contentId', checkWishlistItem);

module.exports = router;
