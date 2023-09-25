export default (sequelize, DataTypes) => {
  const PurchaseDetail = sequelize.define("purchaseDetail",{
    purchaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "purchaseOrders", // Name of the referenced table
        key: "id", // Name of the referenced column
      },
    },
    phoneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "phones", // Name of the referenced table
        key: "id", // Name of the referenced column
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false, 
  })
  return PurchaseDetail;
}