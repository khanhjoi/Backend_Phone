import dbConfig from '../config/dbConfig.js';

import { Sequelize, DataTypes } from 'sequelize';



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

// Phone
import phoneModel from './Phone/phoneModel.js';
import categoryModel from './Phone/categoryModel.js';
import brandModel from './Phone/brandModel.js';
import discountModel from './Phone/discountModel.js';
import colorModel from './Phone/colorModel.js';
import capacityModel from './Phone/capacityModel.js';
import detailImageModel from './Phone/detailImageModel.js';
db.phone = phoneModel(sequelize, DataTypes)
db.category = categoryModel(sequelize, DataTypes)
db.brand = brandModel(sequelize, DataTypes)
db.discount = discountModel(sequelize, DataTypes)
db.color = colorModel(sequelize, DataTypes)
db.capacity = capacityModel(sequelize, DataTypes)
db.imageDetail = detailImageModel(sequelize, DataTypes)
// define relationship with Phone Entity
    db.phone.hasMany(db.discount)
    db.discount.belongsTo(db.phone)
    
    db.brand.hasMany(db.phone)
    db.phone.belongsTo(db.brand)

    db.category.hasMany(db.phone)
    db.phone.belongsTo(db.category)

    db.phone.hasMany(db.capacity)
    db.capacity.belongsTo(db.phone)

    db.phone.hasMany(db.color)
    db.color.belongsTo(db.phone)

    db.color.hasMany(db.imageDetail)
    db.imageDetail.belongsTo(db.color)

    db.phone.hasMany(db.imageDetail, {
      foreignKey: 'phoneId'
    });
    db.imageDetail.belongsTo(db.phone);

// Provider
import Provider from './Provide/Provider.js';
import PurchaseDetail from './Provide/PurchaseDetail.js';
import PurchaseOrder from './Provide/PurchaseOrder.js';
db.provider = Provider(sequelize, DataTypes);
db.purchaseOrder = PurchaseOrder(sequelize, DataTypes);
db.PurchaseDetail = PurchaseDetail(sequelize, DataTypes);
// --------- define relationship ------
db.provider.hasMany(db.purchaseOrder,{
  foreignKey: 'providerId'
})

db.purchaseOrder.belongsTo(db.provider,{
  foreignKey: 'providerId'
})

db.PurchaseDetail.hasMany(db.phone, {
  foreignKey: 'purchaseDetailId'
})

// USER DEFINE 
import User from './User/User.js';
import Address from './User/Address.js';
import Cart from './User/Cart.js';
import DetailCart from './User/DetailCart.js'
import Order from './User/Order.js';
import Payment from './User/Payment.js';
import State from './User/State.js';

db.user = User(sequelize, DataTypes);
db.address = Address(sequelize, DataTypes);
db.cart = Cart(sequelize, DataTypes);
db.order = Order(sequelize, DataTypes);
db.payment = Payment(sequelize, DataTypes);
db.state = State(sequelize, DataTypes);
db.detailCart =  DetailCart(sequelize, DataTypes);

// user -> address
db.user.hasMany(db.address, {
  foreignKey: 'userId'
});

// user -> cart
db.user.hasOne(db.cart, {
  foreignKey: "userId"
});

// cart -> order
db.cart.hasMany(db.order, {
  foreignKey: "cartId"
})

// user -> order
db.user.hasMany(db.order, {
  foreignKey: 'userId',
});

// order -> payment
db.payment.hasMany(db.order, {
  foreignKey: "paymentId"
})
// order -> state
db.state.hasMany(db.order, {
  foreignKey: "stateId"
})

db.cart.belongsToMany(db.phone, { through: db.detailCart })
db.phone.belongsToMany(db.cart, { through: db.detailCart })


db.sequelize.sync({ force: false})
  .then(() => {
    console.log("yes re-sync done!")
  })

export default db;