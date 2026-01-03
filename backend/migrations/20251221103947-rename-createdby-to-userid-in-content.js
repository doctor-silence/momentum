'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Renames the 'createdBy' column to 'userId' in the 'Content' table
     * to match the model definition.
     */
    await queryInterface.renameColumn('Content', 'createdBy', 'userId');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Reverts the column name from 'userId' back to 'createdBy'.
     */
    await queryInterface.renameColumn('Content', 'userId', 'createdBy');
  }
};