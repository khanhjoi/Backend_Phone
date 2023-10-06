export default (sequelize, DataTypes) => {
  const Order = sequelize.define("order",{
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  })
  return Order;
}