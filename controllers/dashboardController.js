const asyncHandler = require('express-async-handler');
const Invoice = require('../models/invoiceModel');
const Client = require('../models/clientModel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Total Revenue (sum of all 'paid' invoices)
  const totalRevenueAgg = Invoice.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  // 2. New clients this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newClientsCount = Client.countDocuments({
    createdAt: { $gte: startOfMonth }
  });

  // 3. Total amount overdue
  const overdueAmountAgg = Invoice.aggregate([
    { $match: { status: 'overdue' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  // 4. Counts of invoices by status
  const invoiceStatusCountsAgg = Invoice.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Execute all promises in parallel for efficiency
  const [revenue, newClients, overdue, statusCounts] = await Promise.all([
    totalRevenueAgg,
    newClientsCount,
    overdueAmountAgg,
    invoiceStatusCountsAgg,
  ]);
  
  // Format the results
  const stats = {
    totalRevenue: revenue[0] ? revenue[0].total : 0,
    newClientsThisMonth: newClients,
    totalOverdueAmount: overdue[0] ? overdue[0].total : 0,
    invoiceStatusCounts: statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };

  res.json(stats);
});

module.exports = { getDashboardStats };
