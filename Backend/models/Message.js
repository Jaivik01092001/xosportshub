const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update conversation's lastMessage and updatedAt when a new message is created
MessageSchema.post('save', async function() {
  try {
    await this.model('Conversation').findByIdAndUpdate(
      this.conversation,
      {
        lastMessage: this._id,
        updatedAt: Date.now()
      }
    );
  } catch (err) {
    console.error('Error updating conversation:', err);
  }
});

module.exports = mongoose.model('Message', MessageSchema);
