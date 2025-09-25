const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Category type is required'],
    enum: ['income', 'expense'],
    index: true
  },
  icon: {
    type: String,
    required: [true, 'Icon is required']
  },
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
categorySchema.index({ type: 1 });
categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);