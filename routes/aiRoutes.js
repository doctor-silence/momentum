const express = require('express');
const router = express.Router();
const { generateContent, generateContentIdeas, chatWithAgent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateContent);
router.post('/generate-ideas', protect, generateContentIdeas);
router.post('/chat', protect, chatWithAgent);

module.exports = router;
