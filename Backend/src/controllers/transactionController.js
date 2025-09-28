const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const asyncHandler = require('express-async-handler');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Transaction.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const transactions = await query;

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// @desc    Get single transaction
// @route   GET /api/v1/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error(`Transaction not found with id of ${req.params.id}`);
  }

  // Check if user is authorized to access this transaction
  if (transaction.createdBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
    res.status(401);
    throw new Error('Not authorized to access this transaction');
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

// @desc    Create new transaction
// @route   POST /api/v1/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const transaction = await Transaction.create(req.body);

  // Update budget if it's an expense
  if (transaction.type === 'expense') {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Find the budget for this category, year, and month
    const budget = await Budget.findOne({
      categoryId: transaction.categoryId,
      year,
      month
    });

    if (budget) {
      // Update the current spent amount
      budget.currentSpent += transaction.amount;
      await budget.save();
    }
  }

  res.status(201).json({
    success: true,
    data: transaction,
  });
});

// @desc    Update transaction
// @route   PUT /api/v1/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error(`Transaction not found with id of ${req.params.id}`);
  }

  // Check if user is authorized to update this transaction
  if (transaction.createdBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
    res.status(401);
    throw new Error('Not authorized to update this transaction');
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error(`Transaction not found with id of ${req.params.id}`);
  }

  // Check if user is authorized to delete this transaction
  if (transaction.createdBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
    res.status(401);
    throw new Error('Not authorized to delete this transaction');
  }

  await transaction.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get transaction stats
// @route   GET /api/v1/transactions/stats
// @access  Private
const getTransactionStats = asyncHandler(async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await Transaction.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: '$createdAt' },
        type: 1,
        amount: 1,
      },
    },
    {
      $group: {
        _id: {
          month: '$month',
          type: '$type',
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Approve transaction
// @route   PUT /api/v1/transactions/:id/approve
// @access  Private/Admin
const approveTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', approvedBy: req.user.id },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    res.status(404);
    throw new Error(`Transaction not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

// @desc    Reject transaction
// @route   PUT /api/v1/transactions/:id/reject
// @access  Private/Admin
const rejectTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', approvedBy: req.user.id },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    res.status(404);
    throw new Error(`Transaction not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  approveTransaction,
  rejectTransaction,
};