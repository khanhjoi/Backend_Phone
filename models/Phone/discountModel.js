export default (sequelize, DataTypes) => {
  const Discount = sequelize.define("discount",{
    nameDiscount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateBegin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }, 
    dateEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    percent: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false, 
  })
  return Discount;
}