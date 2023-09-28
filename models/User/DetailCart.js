export default (sequelize, DataTypes) => {
  const CartDetail = sequelize.define("cartDetail",{
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discountId: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false, 
  })
  return CartDetail;
}