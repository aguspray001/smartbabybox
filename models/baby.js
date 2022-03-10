"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Baby extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Baby.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      Baby.hasMany(models.Measurement, {
        foreignKey: 'baby_id',
        as: 'measurement'
      })
    }
  }
  Baby.init(
    {
      name: DataTypes.STRING,
      born_date: DataTypes.STRING,
      sex: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Baby",
    }
  );
  return Baby;
};
