const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class PromoCode extends Model {}

PromoCode.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['percentage', 'fixed_amount']],
    },
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'PromoCode',
  timestamps: true, // This adds createdAt and updatedAt
});

module.exports = PromoCode;
