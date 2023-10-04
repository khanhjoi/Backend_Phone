export default (sequelize, DataTypes) => {
  const PhoneDetail = sequelize.define('phoneDetail', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false,
  });
  
  PhoneDetail.removeAttribute('id')
  return PhoneDetail;
};