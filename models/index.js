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
import phoneDetail from './Phone/phoneDetail.js';
import categoryModel from './Phone/categoryModel.js';
import brandModel from './Phone/brandModel.js';
import discountModel from './Phone/discountModel.js';
import colorModel from './Phone/colorModel.js';
import capacityModel from './Phone/capacityModel.js';
db.phone = phoneModel(sequelize, DataTypes)
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

// Provider
import PurchaseDetail from './Provide/PurchaseDetail.js';
import PurchaseOrder from './Provide/PurchaseOrder.js';
db.purchaseOrder = PurchaseOrder(sequelize, DataTypes);
db.PurchaseDetail = PurchaseDetail(sequelize, DataTypes);

db.purchaseOrder.hasOne(db.PurchaseDetail, { foreignKey: 'purchaseOrderId', allowNull: false });
db.PurchaseDetail.belongsTo(db.purchaseOrder);
db.phone.hasOne(db.PurchaseDetail, { foreignKey: 'phoneId', allowNull: false });
db.PurchaseDetail.belongsTo(db.phone);
// --------- define relationship ------

// USER DEFINE 
import User from './User/User.js';
import Address from './User/Address.js';
import Cart from './User/Cart.js';
import CartDetail from './User/DetailCart.js'
import Order from './User/Order.js';
import Payment from './User/Payment.js';
import State from './User/State.js';
import Rate from './User/rate.js';

db.user = User(sequelize, DataTypes);
db.address = Address(sequelize, DataTypes);
db.cart = Cart(sequelize, DataTypes);
db.order = Order(sequelize, DataTypes);
db.payment = Payment(sequelize, DataTypes);
db.state = State(sequelize, DataTypes);
db.cartDetail =  CartDetail(sequelize, DataTypes);
db.rate = Rate(sequelize, DataTypes);

// user -> address
db.user.hasMany(db.address, {
  foreignKey: 'userId'
});
db.address.belongsTo(db.user)

// user -> cart
db.user.hasOne(db.cart, {
  foreignKey: "userId"
});
db.cart.belongsTo(db.user)

// cart -> order
db.cart.hasMany(db.order, {
  foreignKey: "cartId"
})
db.order.belongsTo(db.cart);

// user -> order
db.user.hasMany(db.order, {
  foreignKey: 'userId',
});
db.order.belongsTo(db.user)

// order -> payment
db.payment.hasMany(db.order, {
  foreignKey: "OrderIdId"
})
db.order.belongsTo(db.payment)

// order -> state
db.state.hasMany(db.order, {
  foreignKey: "OrderIdId"
})
db.order.belongsTo(db.state)

db.cart.belongsToMany(db.phone, { through: db.cartDetail })
db.phone.belongsToMany(db.cart, { through: db.cartDetail })

// rate USEr
db.user.hasMany(db.rate);
db.rate.belongsTo(db.user);

db.phone.hasMany(db.rate)
db.rate.belongsTo(db.phone)


db.sequelize.sync({ force: false})
  .then(() => {
    console.log("yes re-sync done!")
  })

export default db;