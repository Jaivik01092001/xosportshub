const mongoose = require('mongoose');

const CustomRequestSchema = new mongoose.Schema({
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
  requestedDeliveryDate: {
    type: Date
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [0, 'Budget cannot be negative']
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  sellerResponse: {
    accepted: {
      type: Boolean
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    estimatedDeliveryDate: {
      type: Date
    },
    message: {
      type: String,
      maxlength: [1000, 'Message cannot be more than 1000 characters']
    },
    responseDate: {
      type: Date
    }
  },
  contentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content'
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

module.exports = mongoose.model('CustomRequest', CustomRequestSchema);
