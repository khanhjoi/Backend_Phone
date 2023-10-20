import express from 'express';
import providerController from '../controllers/ProviderController.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.post('/',auth, providerController.createOrder);
router.get('/', auth, providerController.getProviders);
// router.get('/', ProductController.getAllPhone);


export default router;