const asyncHandler = require('express-async-handler');
const { Content, User } = require('../models');

// @desc    Create new content
// @route   POST /api/content
// @access  Private
const createContent = asyncHandler(async (req, res) => {
  const { title, body, platform, content_type, hashtags, status } = req.body;

  // We get the user ID from the 'protect' middleware
  const createdBy = req.user.id;

  if (!title || !body || !platform || !content_type || !createdBy) {
    res.status(400);
    throw new Error('Please provide all required fields (title, body, platform, content_type, createdBy)');
  }

  const content = await Content.create({
    title,
    body,
    platform,
    content_type,
    hashtags,
    status,
    createdBy,
  });

  if (content) {
    res.status(201).json(content);
  } else {
    res.status(400);
    throw new Error('Invalid content data');
  }
});

// @desc    Get authenticated user's content
// @route   GET /api/content
// @access  Private
const getUserContent = asyncHandler(async (req, res) => {
  const content = await Content.findAll({ 
    where: { createdBy: req.user.id },
    order: [['createdAt', 'DESC']]
  });
  res.status(200).json(content);
});

module.exports = {
  createContent,
  getUserContent,
};
