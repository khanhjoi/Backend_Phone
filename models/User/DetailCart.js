import Cart from "./Cart.js";
import phoneModel from "../Phone/phoneModel.js";

export default (sequelize, DataTypes) => {
  const DetailCart = sequelize.define("detailCart",{
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false, 
  })
  return DetailCart;
}