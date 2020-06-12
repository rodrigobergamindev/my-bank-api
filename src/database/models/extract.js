'use strict';
module.exports = (sequelize, DataTypes) => {
  const Extract = sequelize.define('Extract', {
    typeOperation: DataTypes.STRING,
    value: DataTypes.FLOAT,
    date: DataTypes.DATE,
    accountID: DataTypes.INTEGER
  }, {});
  Extract.associate = function(models) {
    Extract.belongsTo(models.Account, {foreignKey: 'accountID', as: 'accounts'})
  };
  return Extract;
};