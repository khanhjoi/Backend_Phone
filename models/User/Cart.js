export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart",{
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    phoneId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    colorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    colorName: {
      type: DataTypes.STRING,
      default: 0
    },
    capacityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    capacityName: {
      type: DataTypes.STRING,
      default: 0
    },
    quantity: {
      type: DataTypes.INTEGER,
      default: 0
    },
    image: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false, 
  })

  
  return Cart;
}