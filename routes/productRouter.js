import express from 'express';
import ProductController from '../controllers/ProductController.js'; 

const router = express.Router();

router.post('/', ProductController.createPhone);
router.get('/', ProductController.getAllPhone);
router.get('/:id', ProductController.getPhone);

export default router;