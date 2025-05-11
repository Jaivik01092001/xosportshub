const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Please add a setting key'],
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please add a setting value']
  },
  group: {
    type: String,
    enum: ['general', 'payment', 'email', 'content', 'user'],
    default: 'general'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
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

// Update the updatedAt field before saving
SettingSchema.pre('save', function(next) {
  if (this.isModified('value')) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Setting', SettingSchema);
