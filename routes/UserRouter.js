import express from 'express';
import { getUser, getAllUser, register, updateUser, login ,createUser, deleteUser } from '../controllers/UserController.js';
import auth from '../middleware/auth.js'
const router = express.Router();

// normal user
router.post('/register', register)
router.post('/login', login)
router.get('/:id', auth, getUser)
router.put('/:id', auth, updateUser)

// admin
// router.post('/', auth, createUser)
router.get('/', auth, getAllUser)
router.delete('/', auth, deleteUser)

export default router;