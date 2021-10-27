'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(order) {
        order.status = 'unconfirm'
      }
    },
    sequelize,
    modelName: 'Order',
  });
  return Order;
};