export default (sequelize, DataTypes) => {
  const PhoneBanner = sequelize.define("phoneBanner",{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isShow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    timestamps: false, 
  })

  return PhoneBanner;
}