export default (sequelize, DataTypes) => {
  const PhoneBanner = sequelize.define("phoneBanner",{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: false, 
  })

  return PhoneBanner;
}