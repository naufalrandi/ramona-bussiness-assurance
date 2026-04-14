"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegionalMinimumWage extends Model {
    static associate(models) {
      RegionalMinimumWage.belongsTo(models.City, {
        foreignKey: "cityId",
        as: "city",
      });
    }
  }
  RegionalMinimumWage.init(
    {
      cityId: DataTypes.BIGINT,
      minimumWage: DataTypes.BIGINT,
      date: DataTypes.DATE,
      histories: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "RegionalMinimumWage",
    },
  );
  return RegionalMinimumWage;
};
