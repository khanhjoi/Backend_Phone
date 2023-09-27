export default (sequelize, DataTypes) => {

  const Address = sequelize.define("address",{
    addressId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    commune: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wart: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detail: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: false, 
  })

  return Address;
}