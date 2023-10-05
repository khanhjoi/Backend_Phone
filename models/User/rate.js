export default (sequelize, DataTypes) => {
  const Rate = sequelize.define("rate",{
    idRate: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    start: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
    }
  })

  return Rate;
}