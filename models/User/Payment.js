export default (sequelize, DataTypes) => {
  const Payment = sequelize.define("payment",{
    namePayment: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false, 
  })

  return Payment;
}