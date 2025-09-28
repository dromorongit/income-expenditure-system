const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: [true, 'Category ID is required']
  },
  categoryName: {
    type: String,
    required: [true, 'Category name is required']
  },
  monthlyLimit: {
    type: Number,
    required: [true, 'Monthly limit is required'],
    min: [0, 'Monthly limit must be positive']
  },
  currentSpent: {
    type: Number,
    default: 0,
    min: [0, 'Current spent must be positive']
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
  },
  month: {
    type: Number,
    required: [true, 'Month is required'],
    min: [0, 'Month must be between 0 and 11'],
    max: [11, 'Month must be between 0 and 11']
  },
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80,
      min: [0, 'Threshold must be between 0 and 100'],
      max: [100, 'Threshold must be between 0 and 100']
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
budgetSchema.index({ categoryId: 1, year: 1, month: 1 });
budgetSchema.index({ year: 1, month: 1 });

module.exports = mongoose.model('Budget', budgetSchema);