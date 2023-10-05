import express from 'express';
import auth from '../middleware/auth.js';
// user controller
import { getUser, getAllUser, register, updateUser, login ,createUser, deleteUser } from '../controllers/UserController.js';
// address controller
import { newAddress, updateAddress, removeAddress } from '../controllers/addressController.js';
// cart controller
import { getCart, addItemToCart, updateItemToCart, removeItemToCart } from '../controllers/cartController.js'


const router = express.Router();

// address of user
router.post('/address', auth ,newAddress);
router.put('/address/:id', auth, updateAddress);
router.delete('/address/:id', auth, removeAddress);

// cart of user
router.get('/cart', auth, getCart);
router.post('/cart', auth, addItemToCart);

// normal user
router.post('/register', register);
router.post('/login', login);
router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);

// admin
// router.post('/', auth, createUser)
router.get('/', auth, getAllUser);
router.delete('/', auth, deleteUser);

export default router;