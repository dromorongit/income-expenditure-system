const express = require('express');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  approveTransaction,
  rejectTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/stats')
  .get(getTransactionStats);

router.route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

router.route('/:id/approve')
  .put(authorize('super_admin', 'finance_admin'), approveTransaction);

router.route('/:id/reject')
  .put(authorize('super_admin', 'finance_admin'), rejectTransaction);

module.exports = router;