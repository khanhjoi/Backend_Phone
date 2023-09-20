export default (sequelize, DataTypes) => {

  const Brand = sequelize.define("brand",{
    brand_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return Brand;
}