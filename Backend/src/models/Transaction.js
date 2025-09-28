const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  categoryId: {
    type: String,
    required: [true, 'Category ID is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required']
  },
  approvedBy: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  receiptUrl: {
    type: String,
    default: null
  },
  recurring: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    nextDate: {
      type: Date,
      default: null
    }
  },
  tags: [{
    type: String
  }],
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ createdBy: 1, date: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);