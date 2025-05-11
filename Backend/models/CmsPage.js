const mongoose = require('mongoose');

const CmsPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Please add a slug'],
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  metaTitle: {
    type: String,
    maxlength: [100, 'Meta title cannot be more than 100 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [200, 'Meta description cannot be more than 200 characters']
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Create slug from title before saving
CmsPageSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  
  if (this.isModified('content') || this.isModified('title') || this.isModified('metaTitle') || this.isModified('metaDescription') || this.isModified('status')) {
    this.updatedAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('CmsPage', CmsPageSchema);
