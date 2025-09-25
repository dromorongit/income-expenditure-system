const express = require('express');
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetReport,
  getBudgetStats,
} = require('../controllers/budgetController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(authorize('super_admin', 'finance_admin'), createBudget);

router.route('/report')
  .get(getBudgetReport);

router.route('/stats')
  .get(getBudgetStats);

router.route('/:id')
  .get(getBudget)
  .put(authorize('super_admin', 'finance_admin'), updateBudget)
  .delete(authorize('super_admin', 'finance_admin'), deleteBudget);

module.exports = router;