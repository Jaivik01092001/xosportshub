const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    mobile: {
      type: String,
      required: [true, 'Please add a mobile number'],
      maxlength: [20, 'Mobile number cannot be longer than 20 characters']
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer'
    },
    profileImage: {
      type: String,
      default: 'default-profile.jpg'
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    sellerInfo: {
      sports: [String],
      expertise: [String],
      experience: String,
      certifications: [String]
    },
    paymentInfo: {
      stripeCustomerId: String,
      stripeConnectId: String,
      defaultPaymentMethod: String
    },
    otpCode: String,
    otpExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    lastLogin: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate OTP
UserSchema.methods.generateOTP = function() {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP and expiration (10 minutes)
  this.otpCode = otp;
  this.otpExpire = Date.now() + 10 * 60 * 1000;

  return otp;
};

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for content
UserSchema.virtual('content', {
  ref: 'Content',
  localField: '_id',
  foreignField: 'seller',
  justOne: false
});

// Virtual for orders as buyer
UserSchema.virtual('purchases', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'buyer',
  justOne: false
});

// Virtual for orders as seller
UserSchema.virtual('sales', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'seller',
  justOne: false
});

module.exports = mongoose.model('User', UserSchema);
