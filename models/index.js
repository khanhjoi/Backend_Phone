import dbConfig from '../config/dbConfig.js';

import { Sequelize, DataTypes } from 'sequelize';


import phoneModel from './Phone/phoneModel.js';
import categoryModel from './Phone/categoryModel.js';
import brandModel from './Phone/brandModel.js';
import discountModel from './Phone/discountModel.js';
import phoneDetailModel from './Phone/phoneDetailModel.js';
import colorModel from './Phone/colorModel.js';
import capacityModel from './Phone/capacityModel.js';
import detailImageModel from './Phone/detailImageModel.js';

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  },
)

sequelize.authenticate()
  .then(() => {
    console.log('Connected....');
  })
  .catch(err => {
    console.log(err);
  })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.phone = phoneModel(sequelize, DataTypes)
db.category = categoryModel(sequelize, DataTypes)
db.brand = brandModel(sequelize, DataTypes)
db.discount = discountModel(sequelize, DataTypes)
db.phoneDetail = phoneDetailModel(sequelize, DataTypes)
db.color = colorModel(sequelize, DataTypes)
db.capacity = capacityModel(sequelize, DataTypes)
db.imageDetail = detailImageModel(sequelize, DataTypes)

// define relationship with entity
db.phone.hasMany(db.discount)
db.brand.hasMany(db.phone)
db.category.hasMany(db.phone)

db.phone.hasOne(db.phoneDetail, {
  foreignKey: 'phoneId'
})
db.phoneDetail.belongsTo(db.phone)

db.color.hasMany(db.imageDetail)
db.imageDetail.belongsTo(db.color)

db.phone.hasMany(db.imageDetail, {
  foreignKey: 'phoneId'
});
db.imageDetail.belongsTo(db.phone);


db.sequelize.sync({ force: false})
  .then(() => {
    console.log("yes re-sync done!")
  })

export default db;