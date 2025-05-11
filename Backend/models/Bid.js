const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: true
  },
  bidder: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a bid amount'],
    min: [0, 'Bid amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['Active', 'Outbid', 'Won', 'Lost', 'Cancelled'],
    default: 'Active'
  },
  isAutoBid: {
    type: Boolean,
    default: false
  },
  maxAutoBidAmount: {
    type: Number,
    min: [0, 'Maximum auto bid amount cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one active bid per content
BidSchema.index({ content: 1, bidder: 1 }, { unique: true });

module.exports = mongoose.model('Bid', BidSchema);
