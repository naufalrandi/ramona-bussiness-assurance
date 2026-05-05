"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      //
    }
  }

  Address.init(
    {
      cityId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      provinceId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      countryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      addressLine2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latlng: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Addresses",
      timestamps: true,
      indexes: [
        {
          fields: ["provinceId"],
        },
        {
          fields: ["cityId"],
        },
        {
          fields: ["countryId"],
        },
        {
          fields: ["name"],
        },
      ],
    },
  );

  return Address;
};
