import express from 'express';
import { upload, remove } from '../controllers/image.Controller.js';

const router = express.Router();

router.post('', upload);
router.delete('', remove);

export default router;