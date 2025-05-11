const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
  verifyEmail
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('role', 'Role must be either buyer or seller').isIn(['buyer', 'seller'])
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.get('/verify-email/:token', verifyEmail);

router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  forgotPassword
);

router.put(
  '/reset-password/:token',
  [
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  resetPassword
);

router.put(
  '/update-password',
  [
    check('currentPassword', 'Current password is required').exists(),
    check(
      'newPassword',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  protect,
  updatePassword
);

module.exports = router;
