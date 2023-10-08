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
import PhoneBanner from './Phone/phoneBanner.js';
import phoneDetail from './Phone/phoneDetail.js';
import categoryModel from './Phone/categoryModel.js';
import brandModel from './Phone/brandModel.js';
import discountModel from './Phone/discountModel.js';
import colorModel from './Phone/colorModel.js';
import capacityModel from './Phone/capacityModel.js';
db.phone = phoneModel(sequelize, DataTypes)
db.PhoneBanner = PhoneBanner(sequelize, DataTypes)
db.category = categoryModel(sequelize, DataTypes)
db.brand = brandModel(sequelize, DataTypes)
db.discount = discountModel(sequelize, DataTypes)
db.color = colorModel(sequelize, DataTypes)
db.capacity = capacityModel(sequelize, DataTypes)
db.phoneDetail = phoneDetail(sequelize, DataTypes)
// define relationship with Phone Entity
  db.brand.hasMany(db.phone)
  db.phone.belongsTo(db.brand);

  db.category.hasMany(db.phone)
  db.phone.belongsTo(db.category);

  db.discount.hasMany(db.phone);
  db.phone.belongsTo(db.discount);

  db.color.hasOne(db.phoneDetail, { foreignKey: 'colorId', primaryKey: true, allowNull: false });
  db.phoneDetail.belongsTo(db.color, { foreignKey: 'colorId' });

  db.capacity.hasOne(db.phoneDetail, { foreignKey: 'capacityId', primaryKey: true, allowNull: false  });
  db.phoneDetail.belongsTo(db.capacity, { foreignKey: 'capacityId' });

  db.phone.hasOne(db.phoneDetail, { foreignKey: 'phoneId', primaryKey: true, allowNull: false  });
  db.phoneDetail.belongsTo(db.phone, { foreignKey: 'phoneId' });

  db.PhoneBanner.hasMany(db.phone)
  db.phone.belongsTo(db.PhoneBanner)

// Provider
import PurchaseDetail from './Provide/PurchaseDetail.js';
import PurchaseOrder from './Provide/PurchaseOrder.js';
db.purchaseOrder = PurchaseOrder(sequelize, DataTypes);
db.PurchaseDetail = PurchaseDetail(sequelize, DataTypes);

// --------- define relationship ------

// USER DEFINE 
import User from './User/User.js';
import Address from './User/Address.js';
import Cart from './User/Cart.js';
import Order from './User/Order.js';
import OrderDetail from './User/OrderDetail.js';
import Payment from './User/Payment.js';
import State from './User/State.js';
import Rate from './User/rate.js';

db.user = User(sequelize, DataTypes);
db.address = Address(sequelize, DataTypes);
db.cart = Cart(sequelize, DataTypes);
db.order = Order(sequelize, DataTypes);
db.orderDetail = OrderDetail(sequelize, DataTypes);
db.payment = Payment(sequelize, DataTypes);
db.state = State(sequelize, DataTypes);
db.rate = Rate(sequelize, DataTypes);

// user -> address
db.user.hasMany(db.address, {
  foreignKey: 'userId'
});
db.address.belongsTo(db.user)

// user with phone -> to cart 
db.user.hasOne(db.cart, {foreignKey: 'userId', primaryKey: true, allowNull: false })
db.cart.belongsTo(db.user)
db.phone.hasMany(db.cart, {foreignKey: 'phoneId', primaryKey: true, allowNull: false })
db.cart.belongsTo(db.phone)

// order -> payment
db.payment.hasMany(db.order, {
  foreignKey: "paymentId"
})
db.order.belongsTo(db.payment)

// order -> state
db.state.hasMany(db.order, {
  foreignKey: "stateId"
})
db.order.belongsTo(db.state)

// user -> order
db.user.hasMany(db.order, {
  foreignKey: 'userId',
});
db.order.belongsTo(db.user)

db.order.hasOne(db.orderDetail, {foreignKey: 'orderId', primaryKey: true, allowNull: false })
db.orderDetail.belongsTo(db.order)
db.phone.hasMany(db.orderDetail, {foreignKey: 'phoneId', primaryKey: true, allowNull: false })
db.cart.belongsTo(db.phone)


// rate USEr
db.user.hasMany(db.rate);
db.rate.belongsTo(db.user);

db.phone.hasMany(db.rate)
db.rate.belongsTo(db.phone)


// create state and payment 
// *Note: if delete table in mysql -> comment all this init then uncomment
// const statePrepare = await db.state.findOne({
//   where:{
//     nameState: "đang chuẩn bị"
//   }
// })
// const stateDelivery = await db.state.findOne({
//   where:{
//     nameState: "đang giao"
//   }
// })
// const stateFinish = await db.state.findOne({
//   where:{
//     nameState: "đã nhận"
//   }
// })

// if(!statePrepare) { 
//   await db.state.create({ nameState: "đang chuẩn bị" })
// }
// if(!stateDelivery) {
//   await db.state.create({ nameState: "đang giao" })
// }
// if(!stateFinish) {
//   await db.state.create({ nameState: "đã nhận" })

// }

// const directPayment = await db.payment.findOne({
//   where:{
//     namePayment: "Thanh toán  trực tiếp"
//   }
// })
// const bankPayment = await db.payment.findOne({
//   where:{
//     namePayment: "Thanh toán qua ngân hàng"
//   }
// })
// const creditPayment = await db.payment.findOne({
//   where:{
//     namePayment: "Thanh toán qua thẻ tín dụng"
//   }
// })

// if(!directPayment) { 
//   await db.payment.create({ namePayment: "Thanh toán  trực tiếp" })
// }
// if(!bankPayment) {
//   await db.payment.create({ namePayment: "Thanh toán qua ngân hàng" })
// }
// if(!creditPayment) {
//   await db.payment.create({ namePayment: "Thanh toán qua thẻ tín dụng" })
// }



db.sequelize.sync({ force: false})
  .then(() => {
    console.log("yes re-sync done!")
  })

export default db;