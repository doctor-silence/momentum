const { sequelize } = require('../config/db');
const User = require('./User');
const Content = require('./Content');
const PromoCode = require('./PromoCode'); // Import the new PromoCode model
const Product = require('./Product');
const ActionLog = require('./ActionLog');
const AuditLog = require('./AuditLog');

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

// A User belongs to a PromoCode (through promoCodeId on User model)
PromoCode.hasMany(User, { foreignKey: 'promoCodeId' });
User.belongsTo(PromoCode, { foreignKey: 'promoCodeId' });
Product.hasMany(User, { foreignKey: 'productId' });
User.hasMany(ActionLog, { foreignKey: 'userId' });
ActionLog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });


const db = {
  sequelize,
  User,
  Content,
  PromoCode, // Add PromoCode to the db object
  Product,
  ActionLog,
  AuditLog,
};

// Function to sync all models
db.syncAll = async () => {
  await sequelize.sync({ alter: true }); // Use alter: true to update tables without dropping them
  console.log("All models were synchronized successfully.");
};

module.exports = db;
