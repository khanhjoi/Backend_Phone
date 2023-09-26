export default (sequelize, DataTypes) => {
  const Capacity = sequelize.define("capacity",{
    nameCapacity: {
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
  return Capacity;
}