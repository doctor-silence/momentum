'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add subscriptionStartDate column
    await queryInterface.addColumn('Users', 'subscriptionStartDate', {
      type: Sequelize.DATE,
      allowNull: true, // or false, depending on requirements
    });

    // Add subscriptionEndDate column
    await queryInterface.addColumn('Users', 'subscriptionEndDate', {
      type: Sequelize.DATE,
      allowNull: true, // or false, depending on requirements
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove subscriptionStartDate column
    await queryInterface.removeColumn('Users', 'subscriptionStartDate');

    // Remove subscriptionEndDate column
    await queryInterface.removeColumn('Users', 'subscriptionEndDate');
  }
};