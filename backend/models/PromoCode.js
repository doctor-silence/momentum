'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PromoCode extends Model {
    static associate(models) {
      // A promo code can be assigned to many users, but a user has one promo code
      // This is a one-to-many relationship from PromoCode to User
      PromoCode.hasMany(models.User, { foreignKey: 'promoCodeId' });
    }
  }

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
    timestamps: true,
  });

  return PromoCode;
};