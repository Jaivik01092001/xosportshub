const express = require('express');
const { check } = require('express-validator');
const {
  register,
  sendOTP,
  verifyOTP,
  getMe,
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
    check('mobile', 'Mobile number is required').not().isEmpty(),
    check('role', 'Role must be either buyer or seller').isIn(['buyer', 'seller'])
  ],
  register
);

router.post(
  '/send-otp',
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('mobile', 'Mobile number is required').optional().not().isEmpty()
  ],
  sendOTP
);

router.post(
  '/verify-otp',
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('otp', 'OTP is required').not().isEmpty()
  ],
  verifyOTP
);

router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
