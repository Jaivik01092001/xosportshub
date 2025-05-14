const express = require('express');
const { check } = require('express-validator');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getSellerProfile,
  verifySeller
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(
    [
      check('firstName', 'First name is required').not().isEmpty(),
      check('lastName', 'Last name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 }),
      check('role', 'Role is required').isIn(['buyer', 'seller', 'admin'])
    ],
    createUser
  );

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/verify-seller/:id', verifySeller);

// Public routes
router.get('/sellers/:id', getSellerProfile);

// User routes
router.put(
  '/profile/:id',
  protect,
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
  ],
  updateProfile
);

module.exports = router;
