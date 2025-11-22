const asyncHandler = require('express-async-handler');
const Content = require('../models/contentModel');

// @desc    Create new content
// @route   POST /api/content
// @access  Private
const createContent = asyncHandler(async (req, res) => {
  const { title, body, platform, content_type, hashtags, target_audience, generation_prompt, status } = req.body;

  console.log("Creating content with body:", req.body);
  console.log("Created by user ID:", req.user.id);

  if (!title || !body || !platform || !content_type) {
    res.status(400);
    throw new Error('Please enter all required fields for content');
  }

  const content = await Content.create({
    title,
    body,
    platform,
    content_type,
    hashtags,
    target_audience,
    generation_prompt,
    status,
    created_by: req.user.id, // User from protect middleware
  });

  res.status(201).json(content);
});

// @desc    Get user content
// @route   GET /api/content
// @access  Private
const getUserContent = asyncHandler(async (req, res) => {
  const content = await Content.find({ created_by: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(content);
});


module.exports = {
  createContent,
  getUserContent,
};
