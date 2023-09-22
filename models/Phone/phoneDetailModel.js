export default (sequelize, DataTypes) => {
  const PhoneDetail = sequelize.define("phoneDetail",{
    phoneId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    capacityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false, 
  })
  PhoneDetail.associate = (models) => {
    PhoneDetail.belongsTo(models.Phone, { foreignKey: 'phoneId', primaryKey: true });
    PhoneDetail.belongsTo(models.Capacity, { foreignKey: 'capacityId' });
    PhoneDetail.belongsTo(models.Color, { foreignKey: 'colorId' });
  };
  return PhoneDetail;
}