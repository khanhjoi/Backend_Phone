export default (sequelize, DataTypes) => {

  const Brand = sequelize.define("brand",{
    brand_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false, 
  })

  return Brand;
}