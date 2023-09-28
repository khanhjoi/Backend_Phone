export default (sequelize, DataTypes) => {
  const DiscountDetail = sequelize.define("discountDetail",{
  }, {
    timestamps: false, 
  })
  
  return DiscountDetail;
}