const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    sport: {
      type: String,
      required: [true, 'Please specify the sport'],
      enum: [
        'Basketball',
        'Football',
        'Soccer',
        'Baseball',
        'Tennis',
        'Golf',
        'Swimming',
        'Volleyball',
        'Running',
        'Cycling',
        'Fitness',
        'Yoga',
        'Other'
      ]
    },
    contentType: {
      type: String,
      required: [true, 'Please specify the content type'],
      enum: ['Video', 'PDF', 'Audio', 'Image', 'Text']
    },
    fileUrl: {
      type: String,
      required: [true, 'Please upload a file']
    },
    previewUrl: {
      type: String
    },
    thumbnailUrl: {
      type: String
    },
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative']
    },
    fileSize: {
      type: Number,
      min: [0, 'File size cannot be negative']
    },
    tags: [String],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
      required: [true, 'Please specify the difficulty level']
    },
    saleType: {
      type: String,
      enum: ['Fixed', 'Auction', 'Both'],
      default: 'Fixed'
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    auctionDetails: {
      startingBid: {
        type: Number,
        min: [0, 'Starting bid cannot be negative']
      },
      minIncrement: {
        type: Number,
        min: [0, 'Minimum increment cannot be negative']
      },
      reservePrice: {
        type: Number,
        min: [0, 'Reserve price cannot be negative']
      },
      endTime: {
        type: Date
      }
    },
    allowCustomRequests: {
      type: Boolean,
      default: false
    },
    customRequestPrice: {
      type: Number,
      min: [0, 'Custom request price cannot be negative']
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft'
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public'
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not be more than 5']
    },
    isCustomContent: {
      type: Boolean,
      default: false
    },
    customRequestId: {
      type: mongoose.Schema.ObjectId,
      ref: 'CustomRequest'
    },
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

// Virtual for reviews
ContentSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'content',
  justOne: false
});

// Virtual for bids
ContentSchema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'content',
  justOne: false
});

module.exports = mongoose.model('Content', ContentSchema);
