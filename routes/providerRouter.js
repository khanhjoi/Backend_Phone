import express from 'express';
import providerController from '../controllers/ProviderController.js';

const router = express.Router();

router.post('/', providerController.createOrder);
// router.get('/', ProductController.getAllPhone);


export default router;