const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide note content'],
  },
  summary: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Add text index for search functionality
noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
