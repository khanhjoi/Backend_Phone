export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart",{
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    timestamps: false, 
  })
  return Cart;
}