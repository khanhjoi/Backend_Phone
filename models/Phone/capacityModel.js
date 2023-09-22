export default (sequelize, DataTypes) => {
  const Capacity = sequelize.define("capacity",{
    nameCapacity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false, 
  })
  return Capacity;
}