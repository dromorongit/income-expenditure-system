const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');

// @desc    Get all budgets
// @route   GET /api/v1/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find();

  res.status(200).json({
    success: true,
    count: budgets.length,
    data: budgets,
  });
});

// @desc    Get single budget
// @route   GET /api/v1/budgets/:id
// @access  Private
const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error(`Budget not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: budget,
  });
});

// @desc    Create new budget
// @route   POST /api/v1/budgets
// @access  Private/Admin
const createBudget = asyncHandler(async (req, res) => {
  const { categoryId, categoryName, monthlyLimit, year, month } = req.body;

  // Check if budget already exists for this category, year, and month
  const budgetExists = await Budget.findOne({
    categoryId,
    year,
    month
  });

  if (budgetExists) {
    res.status(400);
    throw new Error('Budget already exists for this category, year, and month');
  }

  const budget = await Budget.create({
    categoryId,
    categoryName,
    monthlyLimit,
    year,
    month
  });

  res.status(201).json({
    success: true,
    data: budget,
  });
});

// @desc    Update budget
// @route   PUT /api/v1/budgets/:id
// @access  Private/Admin
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!budget) {
    res.status(404);
    throw new Error(`Budget not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: budget,
  });
});

// @desc    Delete budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private/Admin
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findByIdAndDelete(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error(`Budget not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get budget report
// @route   GET /api/v1/budgets/report
// @access  Private
const getBudgetReport = asyncHandler(async (req, res) => {
  const { year, month } = req.query;

  // Get all budgets for the specified year and month
  const budgets = await Budget.find({ year, month });

  // Calculate actual spending for each budget
  const budgetReports = await Promise.all(budgets.map(async (budget) => {
    // Get all transactions for this category in the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const transactions = await Transaction.find({
      categoryId: budget.categoryId,
      date: {
        $gte: startDate,
        $lte: endDate
      },
      type: 'expense'
    });

    // Calculate total spent
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Calculate percentage used
    const percentageUsed = budget.monthlyLimit > 0 ? (totalSpent / budget.monthlyLimit) * 100 : 0;
    
    // Determine status
    let status = 'under';
    if (percentageUsed >= budget.alerts.threshold) {
      status = 'warning';
    }
    if (percentageUsed >= 100) {
      status = 'over';
    }

    return {
      ...budget.toObject(),
      totalSpent,
      percentageUsed,
      status
    };
  }));

  res.status(200).json({
    success: true,
    count: budgetReports.length,
    data: budgetReports,
  });
});

// @desc    Get budget stats
// @route   GET /api/v1/budgets/stats
// @access  Private
const getBudgetStats = asyncHandler(async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await Budget.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: '$createdAt' },
        monthlyLimit: 1,
        currentSpent: 1,
      },
    },
    {
      $group: {
        _id: '$month',
        totalBudget: { $sum: '$monthlyLimit' },
        totalSpent: { $sum: '$currentSpent' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetReport,
  getBudgetStats,
};