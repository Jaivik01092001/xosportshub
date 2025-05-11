const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
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
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: true
  },
  orderType: {
    type: String,
    enum: ['Fixed', 'Auction', 'Custom'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add the order amount']
  },
  platformFee: {
    type: Number,
    required: [true, 'Please add the platform fee']
  },
  sellerEarnings: {
    type: Number,
    required: [true, 'Please add the seller earnings']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentIntentId: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  invoiceUrl: {
    type: String
  },
  bidId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bid'
  },
  customRequestId: {
    type: mongoose.Schema.ObjectId,
    ref: 'CustomRequest'
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloaded: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
