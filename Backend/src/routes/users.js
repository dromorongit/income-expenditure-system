const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('super_admin'));

router.route('/').get(getUsers).post(createUser);
router.route('/stats').get(getUserStats);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;