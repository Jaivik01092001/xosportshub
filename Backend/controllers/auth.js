const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { sendOTP } = require("../utils/sendOTP");
const { validationResult } = require("express-validator");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, mobile, role } = req.body;

    // Check if email already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return next(new ErrorResponse("Email already registered", 400));
    }

    // Check if mobile already exists
    const existingUserMobile = await User.findOne({ mobile });
    if (existingUserMobile) {
      return next(new ErrorResponse("Mobile number already registered", 400));
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      role: role || "buyer",
    });

    // Generate OTP for verification
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    try {
      // Send OTP via SMS and Email
      const otpResult = await sendOTP(user, otp);

      if (!otpResult.success) {
        return next(new ErrorResponse("Failed to send verification code", 500));
      }

      res.status(201).json({
        success: true,
        message: "Registration successful. Please verify with the OTP sent to your email and mobile.",
        userId: user._id
      });
    } catch (err) {
      console.log(err);
      user.otpCode = undefined;
      user.otpExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Failed to send verification code", 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Send OTP for login
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, mobile } = req.body;

    // Check for user by email or mobile
    const user = await User.findOne({
      $or: [
        { email: email },
        { mobile: mobile }
      ]
    });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    try {
      // Send OTP via SMS and Email
      const otpResult = await sendOTP(user, otp);

      if (!otpResult.success) {
        return next(new ErrorResponse("Failed to send verification code", 500));
      }

      res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
        userId: user._id
      });
    } catch (err) {
      console.log(err);
      user.otpCode = undefined;
      user.otpExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Failed to send verification code", 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, otp } = req.body;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Check if OTP exists and is valid
    if (!user.otpCode || !user.otpExpire) {
      return next(new ErrorResponse("No OTP was generated or it has expired", 400));
    }

    // Check if OTP has expired
    if (user.otpExpire < Date.now()) {
      return next(new ErrorResponse("OTP has expired", 400));
    }

    // Check if OTP matches
    if (user.otpCode !== otp) {
      return next(new ErrorResponse("Invalid OTP", 400));
    }

    // Clear OTP fields
    user.otpCode = undefined;
    user.otpExpire = undefined;

    // Set user as verified if not already
    if (!user.isVerified) {
      user.isVerified = true;
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    // Set isVerified to true and remove verification token
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link to reset your password: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {},
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Use JWT_COOKIE_EXPIRE from env or default to 30 days if not set
  const cookieExpire = process.env.JWT_COOKIE_EXPIRE || 30;

  const options = {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
