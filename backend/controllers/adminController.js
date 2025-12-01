const asyncHandler = require('express-async-handler');
const { User, Product, ActionLog, PromoCode, AuditLog } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const yooKassa = require('../config/yookassa');

const getDashboardData = asyncHandler(async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const newUsers = await User.count({ where: { createdAt: { [Op.gte]: oneMonthAgo } } });
  const totalUsers = await User.count();

  const activeSubscribedUsers = await User.findAll({
    where: { subscription_status: 'active', productId: { [Op.ne]: null } },
    include: [{ model: Product, required: true }],
  });

  const mrr = activeSubscribedUsers.reduce((total, user) => total + user.Product.price, 0);
  const arr = mrr * 12;

  const userRegistration = await User.findAll({
    attributes: [
      [fn('date_trunc', 'day', col('createdAt')), 'date'],
      [fn('count', col('id')), 'count'],
    ],
    where: { createdAt: { [Op.gte]: oneMonthAgo } },
    group: ['date'],
    order: [['date', 'ASC']],
    raw: true,
  });

  const planDistribution = await User.findAll({
    attributes: [
      'productId',
      [fn('count', col('User.id')), 'count'],
    ],
    include: [{
      model: Product,
      attributes: ['name'],
      required: true,
    }],
    group: ['productId', 'Product.id', 'Product.name'],
    raw: true,
  });

  const topFeatures = await ActionLog.findAll({
    attributes: [
      'action',
      [fn('count', col('action')), 'count'],
    ],
    group: ['action'],
    order: [[fn('count', col('action')), 'DESC']],
    limit: 10,
    raw: true,
  });

  res.json({
    newUsers,
    totalUsers,
    mrr,
    arr,
    userRegistration,
    planDistribution: planDistribution.map(p => ({ name: p['Product.name'], value: parseInt(p.count, 10) })),
    topFeatures,
    activeUsers: { dau: 0, wau: 0, mau: 0 },
    churnRate: 0,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (search) {
    where[Op.or] = [
      { email: { [Op.iLike]: `%${search}%` } },
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
  });

  res.json({
    users: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [Product],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    const {
      email,
      firstName,
      lastName,
      role,
      subscription_status,
      productId,
    } = req.body;

    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.role = role || user.role;
    user.subscription_status = subscription_status || user.subscription_status;
    user.productId = productId || user.productId;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getPromoCodes = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.findAll({
    order: [['createdAt', 'DESC']],
  });
  res.json(promoCodes);
});

const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, expiresAt, isActive } = req.body;

  const promoCode = await PromoCode.create({
    code,
    discountType,
    discountValue,
    expiresAt,
    isActive,
  });

  res.status(201).json(promoCode);
});

const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, userId, action } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (userId) {
    where.userId = userId;
  }
  if (action) {
    where.action = action;
  }

  const { count, rows } = await AuditLog.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'email'],
    }],
  });

  res.json({
    logs: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
  });
});

const getAiContent = asyncHandler(async (req, res) => {
  console.log('getAiContent called');
  console.log('ActionLog model:', ActionLog);

  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await ActionLog.findAndCountAll({
      where: { action: 'generate_content' },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email'],
      }],
    });

    console.log('ActionLog.findAndCountAll result:', { count, rows });

    res.json({
      content: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error('Error in getAiContent:', error);
    res.status(500).json({ message: error.message });
  }
});

const getPayments = asyncHandler(async (req, res) => {
  try {
    const { limit = 10, cursor } = req.query;
    const payments = await yooKassa.getPaymentList({
      limit,
      cursor,
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments from YooKassa:', error);
    res.status(500).send('Server error');
  }
});

module.exports = {
  getDashboardData,
  getUsers,
  getUserById,
  updateUser,
  getPromoCodes,
  createPromoCode,
  getAuditLogs,
  getAiContent,
  getPayments,
};