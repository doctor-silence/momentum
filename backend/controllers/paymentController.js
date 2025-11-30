const yooKassa = require('../config/yookassa');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new payment
// @route   POST /api/payments/create
// @access  Private
const createPayment = async (req, res) => {
  const { price, currency } = req.body;
  const userId = req.user.id;

  try {
    // DEBUG: Log the CLIENT_URL to see what value the server is using
    console.log('--- DEBUG: Creating payment ---');
    console.log('CLIENT_URL from process.env:', process.env.CLIENT_URL);
    console.log('--- END DEBUG ---');

    const payment = await yooKassa.createPayment({
      amount: {
        value: price,
        currency: currency,
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.CLIENT_URL}/payment-success`,
      },
      description: 'Subscription payment',
      metadata: {
        userId: userId,
      },
    });

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// @desc    Handle Yookassa webhook
// @route   POST /api/payments/webhook
// @access  Public
const handleWebhook = async (req, res) => {
  console.log('Webhook received:', req.body); // Log the entire webhook body

  const { event, object: payment } = req.body;

  try {
    if (event === 'payment.succeeded' || event === 'payment.waiting_for_capture') {
      const userId = payment.metadata.userId;
      console.log('Payment Succeeded/Waiting for capture for userId:', userId, 'Payment ID:', payment.id);

      const user = await User.findByPk(userId);

      if (user) {
        console.log('User found:', user.id);
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(now.getMonth() + 1);

        user.subscription_provider = 'yookassa';
        user.subscription_id = payment.id;
        user.subscription_status = 'active';
        user.has_unlimited_generations = true;
        user.freeGenerationsLeft = 1000;
        user.subscriptionStartDate = now;
        user.subscriptionEndDate = oneMonthLater;

        console.log('Attempting to save user with subscription dates:');
        console.log('  subscriptionStartDate:', user.subscriptionStartDate);
        console.log('  subscriptionEndDate:', user.subscriptionEndDate);

        await user.save();
        console.log('User saved successfully with updated subscription info.');
      } else {
        console.log('User not found for userId:', userId);
      }
    } else {
      console.log('Webhook event is not payment.succeeded or payment.waiting_for_capture. Event:', event);
    }

    res.status(200).send();
  } catch (error) {
    console.error('Error processing Yookassa webhook:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createPayment,
  handleWebhook,
};

