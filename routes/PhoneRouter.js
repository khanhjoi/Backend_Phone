import express from 'express';
import phoneController from '../controllers/phoneController.js';
import discountController from '../controllers/discountController.js';
import auth from '../middleware/auth.js'

import { addComment, updateComment, deleteComment } from '../controllers/commentController.js';


const router = express.Router();

// comment of user
router.post('/:id/comment', auth , addComment);
router.put('/:id/comment/:rateId', auth, updateComment);
router.delete('/:id/comment/:rateId', auth, deleteComment);


// set discount for phone 
// router.get('/discount/phone', auth ,discountController.getPhoneDiscount);
router.put('/discount/:id', auth ,discountController.updateDiscount);
router.delete('/discount/:id', auth ,discountController.deleteDiscount);
router.get('/discount', auth ,discountController.getAllDiscount);
router.post('/discount', auth ,discountController.addDiscount);

// phone router
router.get('/', phoneController.getAllPhone);
router.get('/:id', phoneController.getPhone);

// router.post('/', phoneController.createPhone);

export default router;