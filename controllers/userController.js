const asyncHandler = require('express-async-handler');
const { User } = require('../models'); // Import from models/index.js
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, industry, core_message, brand_voice_tone, writing_style_description, monthly_content_goal, target_audiences, content_pillars, goals_primary_goal, preferred_platforms } = req.body;

  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    industry,
    core_message,
    brand_voice_tone,
    writing_style_description,
    monthly_content_goal,
    target_audiences,
    content_pillars,
    goals_primary_goal,
    preferred_platforms,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
      freeGenerationsLeft: user.freeGenerationsLeft, // Include free generations for new user
      industry: user.industry,
      core_message: user.core_message,
      brand_voice_tone: user.brand_voice_tone,
      writing_style_description: user.writing_style_description,
      monthly_content_goal: user.monthly_content_goal,
      target_audiences: user.target_audiences,
      content_pillars: user.content_pillars,
      goals_primary_goal: user.goals_primary_goal,
      preferred_platforms: user.preferred_platforms,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(401);
    throw new Error('Пользователь с таким email не найден');
  }

  if (await user.comparePassword(password)) {
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
      freeGenerationsLeft: user.freeGenerationsLeft, // Include free generations on login
      industry: user.industry,
      core_message: user.core_message,
      brand_voice_tone: user.brand_voice_tone,
      writing_style_description: user.writing_style_description,
      monthly_content_goal: user.monthly_content_goal,
      target_audiences: user.target_audiences,
      content_pillars: user.content_pillars,
      goals_primary_goal: user.goals_primary_goal,
      preferred_platforms: user.preferred_platforms,
    });
  } else {
    res.status(401);
    throw new Error('Неверный пароль');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  if (user) {
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      freeGenerationsLeft: user.freeGenerationsLeft,
      industry: user.industry,
      core_message: user.core_message,
      brand_voice_tone: user.brand_voice_tone,
      writing_style_description: user.writing_style_description,
      monthly_content_goal: user.monthly_content_goal,
      target_audiences: user.target_audiences,
      content_pillars: user.content_pillars,
      goals_primary_goal: user.goals_primary_goal,
      preferred_platforms: user.preferred_platforms,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get current authenticated user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  if (user) {
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      freeGenerationsLeft: user.freeGenerationsLeft, // Include free generations
      subscription_status: user.subscription_status,
      industry: user.industry,
      core_message: user.core_message,
      brand_voice_tone: user.brand_voice_tone,
      writing_style_description: user.writing_style_description,
      monthly_content_goal: user.monthly_content_goal,
      target_audiences: user.target_audiences,
      content_pillars: user.content_pillars,
      goals_primary_goal: user.goals_primary_goal,
      preferred_platforms: user.preferred_platforms,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update current authenticated user
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { 
    firstName, lastName, email,
    industry, core_message, brand_voice_tone, writing_style_description,
    monthly_content_goal, target_audiences, content_pillars,
    goals_primary_goal, preferred_platforms
  } = req.body;

  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update user fields
  user.firstName = firstName !== undefined ? firstName : user.firstName;
  user.lastName = lastName !== undefined ? lastName : user.lastName;
  user.email = email !== undefined ? email : user.email; // Consider if email update should be more secure (e.g., re-verification)

  user.industry = industry !== undefined ? industry : user.industry;
  user.core_message = core_message !== undefined ? core_message : user.core_message;
  user.brand_voice_tone = brand_voice_tone !== undefined ? brand_voice_tone : user.brand_voice_tone;
  user.writing_style_description = writing_style_description !== undefined ? writing_style_description : user.writing_style_description;
  user.monthly_content_goal = monthly_content_goal !== undefined ? monthly_content_goal : user.monthly_content_goal;
  user.target_audiences = target_audiences !== undefined ? target_audiences : user.target_audiences;
  user.content_pillars = content_pillars !== undefined ? content_pillars : user.content_pillars;
  user.goals_primary_goal = goals_primary_goal !== undefined ? goals_primary_goal : user.goals_primary_goal;
  user.preferred_platforms = preferred_platforms !== undefined ? preferred_platforms : user.preferred_platforms;

  await user.save();

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    freeGenerationsLeft: user.freeGenerationsLeft,
    industry: user.industry,
    core_message: user.core_message,
    brand_voice_tone: user.brand_voice_tone,
    writing_style_description: user.writing_style_description,
    monthly_content_goal: user.monthly_content_goal,
    target_audiences: user.target_audiences,
    content_pillars: user.content_pillars,
    goals_primary_goal: user.goals_primary_goal,
    preferred_platforms: user.preferred_platforms,
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
});

// @desc    Activate subscription manually
// @route   PUT /api/users/me/activate-subscription
// @access  Private
const activateSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.subscription_status = 'active';
  user.has_unlimited_generations = true;
  await user.save();

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    freeGenerationsLeft: user.freeGenerationsLeft,
    subscription_status: user.subscription_status,
    has_unlimited_generations: user.has_unlimited_generations,
    industry: user.industry,
    core_message: user.core_message,
    brand_voice_tone: user.brand_voice_tone,
    writing_style_description: user.writing_style_description,
    monthly_content_goal: user.monthly_content_goal,
    target_audiences: user.target_audiences,
    content_pillars: user.content_pillars,
    goals_primary_goal: user.goals_primary_goal,
    preferred_platforms: user.preferred_platforms,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getMe,
  updateMe,
  getUsers,
  activateSubscription,
};