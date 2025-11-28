const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class ActionLog extends Model {}

ActionLog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  sequelize,
  modelName: 'ActionLog',
  updatedAt: false, // We only care about when the action was created
});

module.exports = ActionLog;
