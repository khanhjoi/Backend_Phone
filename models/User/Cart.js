export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart",{
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    },
  }, {
    timestamps: false, 
  })
  return Cart;
}