const express = require('express');
const router = express.Router();
const { getUserProfile, getUsers, getMe } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.get('/me', getMe); // New route to get current user details

// Admin routes
router.get('/', admin, getUsers);

module.exports = router;