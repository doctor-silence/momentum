const express = require('express');
const router = express.Router();
const { generateContent, generateContentIdeas } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', generateContent);
router.post('/generate-ideas', generateContentIdeas);

module.exports = router;
