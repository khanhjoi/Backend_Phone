export default (sequelize, DataType) => {

  const PurchaseOrder = sequelize.define("purchaseOrder",{
    purchaseName: {
      type: DataType.STRING,
      allowNull: false
    },
    totalPrice: {
      type: DataType.INTEGER,
      allowNull: false
    }
  })

  return PurchaseOrder;
}