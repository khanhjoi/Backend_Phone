export default (sequelize, DataTypes) => {
  const CartDetail = sequelize.define("cartDetail",{
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false, 
  });
  return CartDetail;
}