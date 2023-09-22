export default (sequelize, DataTypes) => {
  const Discount = sequelize.define("discount",{
    name_discount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_begin: {
      type: DataTypes.DATE,
      allowNull: false
    }, 
    date_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    percent: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: false, 
  })
  return Discount;
}