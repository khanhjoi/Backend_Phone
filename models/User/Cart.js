export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart",{

    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    timestamps: false, 
  })
  return Cart;
}