import dbConfig from '../config/dbConfig.js';

import { Sequelize, DataTypes } from 'sequelize';


import phoneModel from './Phone/phoneModel.js';
import categoryModel from './Phone/categoryModel.js';
import brandModel from './Phone/brandModel.js';
import discountModel from './Phone/discountModel.js';

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

// define relationship with entity
db.phone.hasMany(db.discount)
db.brand.hasMany(db.phone)
db.category.hasMany(db.phone)


db.sequelize.sync({ force: false})
  .then(() => {
    console.log("yes re-sync done!")
  })

export default db;