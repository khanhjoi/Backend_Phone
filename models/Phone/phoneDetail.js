export default (sequelize, DataTypes) => {
  const PhoneDetail = sequelize.define('phoneDetail', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Image_Detail: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: false,
  });
  
  PhoneDetail.removeAttribute('id')
  return PhoneDetail;
};