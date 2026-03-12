"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContractTemplateComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ContractTemplateComment.init(
    {
      userId: DataTypes.UUID,
      contractTemplateId: DataTypes.UUID,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ContractTemplateComment",
    },
  );
  return ContractTemplateComment;
};
