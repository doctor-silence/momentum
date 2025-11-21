const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['item', 'hour', 'day'],
    default: 'item',
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
