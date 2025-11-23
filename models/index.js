const { sequelize } = require('../config/db');
const User = require('./User');
const Content = require('./Content');

// --- Define Associations ---

// User has many Content posts
User.hasMany(Content, {
  foreignKey: {
    name: 'createdBy',
    allowNull: false
  },
  onDelete: 'CASCADE', // If a user is deleted, their content is also deleted.
});
Content.belongsTo(User, {
  foreignKey: 'createdBy',
});


const db = {
  sequelize,
  User,
  Content,
};

// Function to sync all models
db.syncAll = async () => {
  await sequelize.sync({ alter: true }); // Use alter: true to update tables without dropping them
  console.log("All models were synchronized successfully.");
};

module.exports = db;
