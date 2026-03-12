"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContractTemplate extends Model {
    static associate(models) {
      ContractTemplate.hasMany(models.ContractTemplateComment, {
        foreignKey: "contractTemplateId",
        as: "comments",
      });
    }
  }

  ContractTemplate.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      contractTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      approverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewerIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      standardClauses: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
      histories: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ContractTemplate",
      timestamps: true,
      underscored: false,
    }
  );

  return ContractTemplate;
};
