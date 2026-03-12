'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViolationCategory extends Model {
    static associate(models) {
      ViolationCategory.belongsTo(models.Sanction, {
        foreignKey: "applicableSanctionId",
        as: "sanction",
      })
    }
  }
  ViolationCategory.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    applicableSanctionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ViolationCategory',
  });
  return ViolationCategory;
};