const cron = require('node-cron');
const User = require('../models/User');

const checkAndExpireSubscriptions = async () => {
  console.log('Running subscription expiry check...');
  try {
    const now = new Date();
    const expiredUsers = await User.findAll({
      where: {
        subscription_status: 'active',
        subscriptionEndDate: {
          [require('sequelize').Op.lt]: now, // Op.lt means "less than"
        },
      },
    });

    for (const user of expiredUsers) {
      console.log(`User ${user.id} subscription expired. Downgrading...`);
      user.subscription_status = 'expired';
      user.has_unlimited_generations = false;
      user.freeGenerationsLeft = 0; // Or any other default free tier limit
      await user.save();
      console.log(`User ${user.id} downgraded successfully.`);
    }

    console.log(`Subscription expiry check complete. ${expiredUsers.length} subscriptions expired.`);
  } catch (error) {
    console.error('Error in subscription expiry check:', error);
  }
};

const initSubscriptionJobs = () => {
  // Schedule the job to run once every day at midnight
  cron.schedule('0 0 * * *', checkAndExpireSubscriptions, {
    scheduled: true,
    timezone: "Europe/Moscow" // Adjust timezone as needed
  });
  console.log('Subscription expiry job scheduled to run daily at midnight (Europe/Moscow).');

  // Run immediately on startup for testing/initial check
  checkAndExpireSubscriptions();
};

module.exports = {
  initSubscriptionJobs,
  checkAndExpireSubscriptions, // Export for manual testing if needed
};
