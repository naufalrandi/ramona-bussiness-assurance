"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegulatoryCompensation extends Model {
    static associate(models) {
      // define association here
    }
  }
  RegulatoryCompensation.init(
    {
      compensationType: DataTypes.STRING,
      compensationLabel: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "RegulatoryCompensation",
    },
  );
  return RegulatoryCompensation;
};
