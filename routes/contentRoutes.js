const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { createContent, getUserContent, updateContent } = require('../controllers/contentController');

router.route('/')
  .post(protect, createContent)
  .get(protect, getUserContent);

router.route('/:id')
    .put(protect, updateContent);

module.exports = router;
