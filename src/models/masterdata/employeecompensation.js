"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeCompensation extends Model {
    static associate(models) {
      // define association here
    }
  }
  EmployeeCompensation.init(
    {
      type: DataTypes.STRING,
      label: DataTypes.STRING,
      scheme: DataTypes.STRING,
      unit: DataTypes.STRING,
      method: DataTypes.STRING,
      pricing: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "EmployeeCompensation",
    },
  );
  return EmployeeCompensation;
};
