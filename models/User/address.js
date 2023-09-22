export default (sequelize, DataTypes) => {

  const User = sequelize.define("user",{
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nameAdd: {
      type: DataTypes.STRING,
      allowNull: false
    },
  })

  return User;
}