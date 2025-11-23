const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Content extends Model {}

Content.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hashtags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  target_audience: {
    type: DataTypes.STRING,
  },
  generation_prompt: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'draft',
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // created_by will be an association
}, {
  sequelize,
  modelName: 'Content',
});

module.exports = Content;
