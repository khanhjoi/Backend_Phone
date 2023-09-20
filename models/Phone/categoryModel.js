export default (sequelize, DataType) => {

  const Category = sequelize.define("category",{
    category_name: {
      type: DataType.STRING,
      allowNull: false
    }
  })

  return Category;
}