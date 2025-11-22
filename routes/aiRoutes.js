const express = require('express');
const router = express.Router();
const { generateContent, generateContentIdeas, chatWithAgent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', generateContent);
router.post('/generate-ideas', generateContentIdeas);
router.post('/chat', chatWithAgent);

module.exports = router;
