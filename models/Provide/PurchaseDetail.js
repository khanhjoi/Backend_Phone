export default (sequelize, DataTypes) => {
  const PurchaseDetail = sequelize.define('purchaseDetail', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    capacityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    phoneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    }
  }, {
    timestamps: false,
  });

  PurchaseDetail.associate = (models) => {
    PurchaseDetail.belongsTo(models.color, { foreignKey: 'colorId', primaryKey: true });
    PurchaseDetail.belongsTo(models.capacity, { foreignKey: 'capacityId' , primaryKey: true });
    PurchaseDetail.belongsTo(models.phone, { foreignKey: 'phoneId', primaryKey: true  });
    PurchaseDetail.belongsTo(models.purchaseOrder, { foreignKey: 'purchaseOrderId', primaryKey: true  });
    // Add associations to other models if required
  };
  return PurchaseDetail;
};