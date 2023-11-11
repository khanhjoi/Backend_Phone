import express from 'express';
import auth from '../middleware/auth.js';
// user controller
import { getUser, getAllUser, register, updateUser, login , createUser, deleteUser, updateUserAdmin, isAdmin} from '../controllers/UserController.js';
// address controller
import { newAddress, updateAddress, removeAddress } from '../controllers/addressController.js';
// cart controller
import { getCart, addItemToCart, updateItemToCart, removeItemToCart } from '../controllers/cartController.js'

import { getOrderUser, getAllOrderUser, createOrder,  getAllOrderAdminToAccept, getAllOrderAdmin, handleOrderAdmin, handleOrderUser, deleteOrder} from '../controllers/orderController.js';

import { getNumberPhones, getNumberOrder , getNumberOrderAccept, getNumberPhoneAlarm, getInComeRevenue} from '../controllers/statisticController.js';

const router = express.Router();

// normal user
router.post('/register', register);
router.post('/login', login);
router.patch('/admin', auth, updateUserAdmin);
router.get('/admin', auth, isAdmin)
router.patch('/', auth, updateUser);
router.get('/', auth, getUser);

// address of user
router.post('/address', auth ,newAddress);
router.put('/address/:id', auth, updateAddress);
router.delete('/address', auth, removeAddress);

// order of user
router.get('/order', auth, getAllOrderUser);
router.get('/order/:id', auth, getOrderUser);
router.post('/order', auth, createOrder);
router.post('/handleOrder', auth, handleOrderUser);
router.delete('/order/:id', auth, deleteOrder);

// cart of user
router.get('/cart', auth, getCart);
router.post('/cart', auth, addItemToCart);
router.put('/cart', auth, updateItemToCart);
router.delete('/cart', auth, removeItemToCart);

// admin
// router.post('/', auth, createUser);
router.get('/getAll', auth, getAllUser);
router.delete('/', auth, deleteUser);

router.get('/statistic/numberPhone', auth ,getNumberPhones)
router.get('/statistic/numberPhoneAlarm', auth, getNumberPhoneAlarm)
router.get('/statistic/numberOrder',auth, getNumberOrder)
router.get('/statistic/numberOrderAccept', auth, getNumberOrderAccept)
router.post('/statistic/income', auth, getInComeRevenue)

// get order to accept -> order of admin
router.get('/admin/order', auth, getAllOrderAdminToAccept);
router.get('/admin/order/manage', auth, getAllOrderAdmin);
router.post('/admin/order', auth, handleOrderAdmin);


export default router;