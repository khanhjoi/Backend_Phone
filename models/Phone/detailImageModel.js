export default (sequelize, DataTypes) => {
  const detailImage = sequelize.define("detailImage",{
    idImage:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    imageDetail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false, 
  })
  return detailImage;
}