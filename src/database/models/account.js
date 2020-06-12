'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    holder: DataTypes.STRING,
    agency: DataTypes.STRING,
    number: DataTypes.STRING,
    balance: DataTypes.FLOAT,
  }, {});
  Account.associate = function(models) {
    Account.hasMany(models.Extract, {as: 'extracts'})
  };
  return Account;
};