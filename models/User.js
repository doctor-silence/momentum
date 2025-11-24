const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

class User extends Model {
  // Method to compare passwords
  comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  googleId: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for Google OAuth users
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // --- Profile Fields ---
  industry: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  core_message: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  brand_voice_tone: { // Storing tone directly
    type: DataTypes.STRING,
    defaultValue: 'professional',
  },
  writing_style_description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  monthly_content_goal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  target_audiences: { // Storing as JSON array of objects
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  content_pillars: { // Storing as JSON array of strings
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  goals_primary_goal: { // Storing primary_goal directly
    type: DataTypes.STRING,
    defaultValue: '',
  },
  preferred_platforms: { // Storing as JSON array of strings
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // --- End Profile Fields ---
  role: {
    type: DataTypes.STRING,
    defaultValue: 'manager',
  },
  freeGenerationsLeft: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

module.exports = User;
