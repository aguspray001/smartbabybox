"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Measurement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Measurement.belongsTo(models.Baby, {
        foreignKey: "baby_id",
        as: "baby",
      });
    }
  }
  Measurement.init(
    {
      height: DataTypes.FLOAT,
      weight: DataTypes.FLOAT,
      temperature: DataTypes.FLOAT,
      head_size: DataTypes.FLOAT,
      baby_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Measurement",
    }
  );
  return Measurement;
};
