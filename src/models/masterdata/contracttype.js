"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContractType extends Model {
    static associate(models) {
      // define association here
    }
  }
  ContractType.init(
    {
      categoryCode: DataTypes.STRING,
      categoryName: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ContractType",
    },
  );
  return ContractType;
};
