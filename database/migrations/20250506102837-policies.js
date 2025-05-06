'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('policies', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      user_id: { type: Sequelize.UUID, allowNull: false },
      vehicle_id: { type: Sequelize.UUID, allowNull: false },
      agent_id: { type: Sequelize.UUID },
      policy_type: { type: Sequelize.STRING, allowNull: false },
      policy_number: { type: Sequelize.STRING, allowNull: false },
      premium: Sequelize.DECIMAL(12, 2),
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('policies');
  }
};
