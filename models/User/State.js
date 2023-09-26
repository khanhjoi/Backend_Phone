export default (sequelize, DataTypes) => {
  const State = sequelize.define("state",{
    stateId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nameState: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false, 
  })

  return State;
}