const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add the payment amount'],
    min: [0, 'Payment amount cannot be negative']
  },
  platformFee: {
    type: Number,
    required: [true, 'Please add the platform fee'],
    min: [0, 'Platform fee cannot be negative']
  },
  sellerEarnings: {
    type: Number,
    required: [true, 'Please add the seller earnings'],
    min: [0, 'Seller earnings cannot be negative']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add the payment method']
  },
  paymentIntentId: {
    type: String,
    required: [true, 'Please add the payment intent ID']
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  payoutStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed'],
    default: 'Pending'
  },
  payoutId: {
    type: String
  },
  payoutDate: {
    type: Date
  },
  refundId: {
    type: String
  },
  refundDate: {
    type: Date
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
