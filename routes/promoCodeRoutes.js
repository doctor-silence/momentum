const express = require('express');
const router = express.Router();
const { generatePromoCode } = require('../controllers/promoCodeController');

router.route('/').post(generatePromoCode);

module.exports = router;
