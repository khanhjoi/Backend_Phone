export default (sequelize, DataTypes) => {
  const Color = sequelize.define("color",{
    nameColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    additionalPrice: {
      type: DataTypes.INTEGER,
      default: 0
    },
  }, {
    timestamps: false, 
  })
  return Color;
}