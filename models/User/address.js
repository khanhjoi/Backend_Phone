export default (sequelize, DataTypes) => {

  const Address = sequelize.define("address",{
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nameAdd: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false, 
  })

  return Address;
}