const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize'); // Standard import

const checkAndExpireSubscriptions = async () => {
  console.log('Running subscription expiry check...');
  try {
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
  cron.schedule('0 0 * * *', checkAndExpireSubscriptions, {
    scheduled: true,
    timezone: "Europe/Moscow"
  });
  console.log('Subscription expiry job scheduled to run daily at midnight (Europe/Moscow).');

  checkAndExpireSubscriptions();
};

module.exports = {
  initSubscriptionJobs,
  checkAndExpireSubscriptions,
};
