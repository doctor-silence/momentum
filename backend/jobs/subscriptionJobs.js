const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize');

const checkAndExpireSubscriptions = async () => {
  console.log('Running subscription expiry check...');
  try {
    // This seemingly redundant query appears to resolve a timing issue.
    // It was discovered when verbose logging was added and the bug disappeared.
    await User.findAll({ where: { subscription_status: 'active' }, limit: 1 });

    const now = new Date();
    const expiredUsers = await User.findAll({
      where: {
        subscription_status: 'active',
        subscriptionEndDate: {
          [Op.lt]: now,
        },
      },
    });

    for (const user of expiredUsers) {
      console.log(`User ${user.id} subscription expired. Downgrading...`);
      user.subscription_status = 'expired';
      user.has_unlimited_generations = false;
      user.freeGenerationsLeft = 0;
      await user.save();
      console.log(`User ${user.id} downgraded successfully.`);
    }

    console.log(`Subscription expiry check complete. ${expiredUsers.length} subscriptions expired.`);
  } catch (error) {
    console.error('Error in subscription expiry check:', error);
  }
};

const initSubscriptionJobs = () => {
  cron.schedule('*/10 * * * *', checkAndExpireSubscriptions, {
    scheduled: true,
    timezone: "Europe/Moscow" // Adjust timezone as needed
  });
  console.log('Subscription expiry job scheduled to run every 10 minutes (Europe/Moscow).');

  checkAndExpireSubscriptions();
};

module.exports = {
  initSubscriptionJobs,
  checkAndExpireSubscriptions,
};
