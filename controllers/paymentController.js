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
  const { event, object: payment } = req.body;

  try {
    if (event === 'payment.succeeded') {
      const userId = payment.metadata.userId;
      const user = await User.findByPk(userId);

      if (user) {
        user.subscription_provider = 'yookassa';
        user.subscription_id = payment.id;
        user.subscription_status = 'active';
        await user.save();
      }
    }

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createPayment,
  handleWebhook,
};
