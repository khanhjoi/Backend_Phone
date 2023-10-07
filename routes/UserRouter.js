import express from 'express';
import auth from '../middleware/auth.js';
// user controller
import { getUser, getAllUser, register, updateUser, login ,createUser, deleteUser } from '../controllers/UserController.js';
// address controller
import { newAddress, updateAddress, removeAddress } from '../controllers/addressController.js';
// cart controller
import { getCart, addItemToCart, updateItemToCart, removeItemToCart } from '../controllers/cartController.js'

import { getOrderUser, getAllOrderUser, createOrder,  getAllOrderAdmin, handleOrderAdmin, handleOrderUser, deleteOrder} from '../controllers/orderController.js';


const router = express.Router();

// address of user
router.post('/address', auth ,newAddress);
router.put('/address/:id', auth, updateAddress);
router.delete('/address/:id', auth, removeAddress);

// order of user
router.get('/order', auth, getAllOrderUser);
router.get('/order/:id', auth, getOrderUser);
router.post('/order', auth, createOrder);
router.post('/getOrder', auth, handleOrderUser);
router.delete('/order/:id', auth, deleteOrder);

// cart of user
router.get('/cart', auth, getCart);
router.post('/cart', auth, addItemToCart);
router.put('/cart', auth, updateItemToCart);
router.delete('/cart', auth, removeItemToCart);

// normal user
router.post('/register', register);
router.post('/login', login);
router.get('/', auth, getUser);
router.put('/', auth, updateUser);

// admin
// router.post('/', auth, createUser)
router.get('/', auth, getAllUser);
router.delete('/', auth, deleteUser);
router.get('/admin/order', auth, getAllOrderAdmin);
router.post('/admin/order', auth, handleOrderAdmin);

export default router;