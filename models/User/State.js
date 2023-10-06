export default (sequelize, DataTypes) => {
  const State = sequelize.define("state",{

    nameState: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false, 
  })

  return State;
}