const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  text: {
    type: String,
    required: [true, 'Please add a review text'],
    maxlength: [500, 'Review text cannot be more than 500 characters']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per content
ReviewSchema.index({ content: 1, user: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function(contentId) {
  const obj = await this.aggregate([
    {
      $match: { content: contentId }
    },
    {
      $group: {
        _id: '$content',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Content').findByIdAndUpdate(contentId, {
      averageRating: obj[0] ? obj[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.content);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.content);
});

module.exports = mongoose.model('Review', ReviewSchema);
