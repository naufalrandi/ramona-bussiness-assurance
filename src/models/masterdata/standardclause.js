"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StandardClause extends Model {
    static associate(models) {
      StandardClause.belongsTo(models.Standard, {
        foreignKey: "standardId",
        as: "standard",
      });
    }
  }
  StandardClause.init(
    {
      standardId: DataTypes.UUID,
      clauseNumber: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "StandardClause",
    }
  );
  return StandardClause;
};
