export default (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define("orderDetail",{
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    phoneId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    colorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    capacityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    colorName: {
      type: DataTypes.STRING,
      default: 0
    },
    capacityName: {
      type: DataTypes.STRING,
      default: 0
    },
    quantity: {
      type: DataTypes.INTEGER,
      default: 0
    }
  },{
    timestamps: false, 
  })
  return OrderDetail;
}