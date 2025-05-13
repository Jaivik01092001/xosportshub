const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
});

// Prevent user from adding the same content to wishlist multiple times
WishlistSchema.index({ user: 1, content: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
