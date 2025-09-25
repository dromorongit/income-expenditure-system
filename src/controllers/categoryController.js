const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error(`Category not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    res.status(404);
    throw new Error(`Category not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error(`Category not found with id of ${req.params.id}`);
  }

  // Check if there are transactions associated with this category
  const transactions = await Transaction.find({ categoryId: req.params.id });

  if (transactions.length > 0) {
    // Instead of deleting, mark as inactive
    category.isActive = false;
    await category.save();
  } else {
    // No transactions, safe to delete
    await category.remove();
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get category stats
// @route   GET /api/v1/categories/stats
// @access  Private
const getCategoryStats = asyncHandler(async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await Category.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: '$createdAt' },
        type: 1,
      },
    },
    {
      $group: {
        _id: {
          month: '$month',
          type: '$type',
        },
        total: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Get categories with transaction counts
// @route   GET /api/v1/categories/with-transactions
// @access  Private
const getCategoriesWithTransactions = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });

  const categoriesWithTransactions = await Promise.all(categories.map(async (category) => {
    const transactionCount = await Transaction.countDocuments({ categoryId: category._id });
    return {
      ...category.toObject(),
      transactionCount
    };
  }));

  res.status(200).json({
    success: true,
    count: categoriesWithTransactions.length,
    data: categoriesWithTransactions,
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  getCategoriesWithTransactions,
};