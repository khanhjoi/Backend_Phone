export default (sequelize, DataType) => {
  const Provider = sequelize.define("provider",{
    providerName: {
      type: DataType.STRING,
      allowNull: false
    },
    providerLocation: {
      type: DataType.STRING,
      allowNull: false
    }
  }, {
    timestamps: false, 
  })

  return Provider;
}