import express from 'express';
import phoneController from '../controllers/phoneController.js';
import discountController from '../controllers/discountController.js';
import auth from '../middleware/auth.js'

const router = express.Router();

// set discount for phone 
router.get('/discount', auth ,discountController.getAllDiscount);
router.post('/discount', auth ,discountController.addDiscount);
router.put('/discount', auth ,discountController.updateDiscount);
router.get('/discount/:idPhone', auth ,discountController.getPhoneDiscount);
router.delete('/discount:id', auth ,discountController.deleteDiscount);


// phone router
router.get('/', phoneController.getAllPhone);
router.get('/:id', phoneController.getPhone);

// router.post('/', phoneController.createPhone);

export default router;