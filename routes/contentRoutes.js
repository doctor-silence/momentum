const express = require('express');
const router = express.Router();
const { createContent, getUserContent } = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createContent)
  .get(protect, getUserContent);

module.exports = router;
