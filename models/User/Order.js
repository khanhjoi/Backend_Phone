export default (sequelize, DataTypes) => {
  const Order = sequelize.define("order",{
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  })
  return Order;
}