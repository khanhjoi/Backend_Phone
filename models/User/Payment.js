export default (sequelize, DataTypes) => {
  const Payment = sequelize.define("payment",{
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    namePayment: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false, 
  })

  return Payment;
}