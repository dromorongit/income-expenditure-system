const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  getCategoriesWithTransactions,
} = require('../controllers/categoryController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getCategories)
  .post(authorize('super_admin', 'finance_admin'), createCategory);

router.route('/with-transactions')
  .get(protect, getCategoriesWithTransactions);

router.route('/stats')
  .get(protect, getCategoryStats);

router.route('/:id')
  .get(getCategory)
  .put(authorize('super_admin', 'finance_admin'), updateCategory)
  .delete(authorize('super_admin', 'finance_admin'), deleteCategory);

module.exports = router;