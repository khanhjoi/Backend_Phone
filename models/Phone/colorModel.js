export default (sequelize, DataTypes) => {
  const Color = sequelize.define("Color",{
    nameColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false, 
  })
  return Color;
}