export default (sequelize, DataTypes) => {

  const Phone = sequelize.define("phone",{
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  })

  return Phone;
}