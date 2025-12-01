const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize'); // More standard import

const checkAndExpireSubscriptions = async () => {
  console.log('--- Running Subscription Expiry Check ---');
  try {
    const now = new Date();
    console.log(`Current server time (UTC): ${now.toUTCString()}`);

    const activeSubscriptions = await User.findAll({
        where: { subscription_status: 'active' }
    });

    if (activeSubscriptions.length === 0) {
        console.log("No active subscriptions found.");
        console.log('--- Subscription Expiry Check Complete ---');
        return;
    }

    console.log(`Found ${activeSubscriptions.length} active subscriptions to check.`);
    activeSubscriptions.forEach(user => {
        console.log(`- User ID: ${user.id}, Email: ${user.email}, Subscription End Date: ${user.subscriptionEndDate ? user.subscriptionEndDate.toUTCString() : 'N/A'}`);
    });


    const expiredUsers = await User.findAll({
      where: {
        subscription_status: 'active',
        subscriptionEndDate: {
          [Op.lt]: now,
        },
      },
    });

    console.log(`Found ${expiredUsers.length} users with expired subscriptions based on the query.`);

    if (expiredUsers.length > 0) {
        for (const user of expiredUsers) {
          console.log(`User ${user.id} (${user.email}) subscription expired on ${user.subscriptionEndDate.toUTCString()}. Downgrading...`);
          user.subscription_status = 'expired';
          user.has_unlimited_generations = false;
          user.freeGenerationsLeft = 0;
          await user.save();
          console.log(`User ${user.id} downgraded successfully.`);
        }
    }

    console.log(`--- Subscription Expiry Check Complete. ${expiredUsers.length} subscriptions processed. ---`);
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
  console.log('Running initial subscription check on startup...');
  checkAndExpireSubscriptions();
};

module.exports = {
  initSubscriptionJobs,
  checkAndExpireSubscriptions, // Export for manual testing if needed
};
