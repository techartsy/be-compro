'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portofolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Portofolio.init({
    mainimage: DataTypes.STRING,
    secondimage: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    thumbnail: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Portofolio',
  });
  return Portofolio;
};