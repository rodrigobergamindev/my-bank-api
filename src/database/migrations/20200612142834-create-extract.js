'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Extracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      typeOperation: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.FLOAT
      },
      date: {
        type: Sequelize.DATE
      },
      accountID: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: 'Accounts',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Extracts');
  }
};