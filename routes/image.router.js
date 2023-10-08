import express from 'express';
import { upload, remove } from '../controllers/image.Controller.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.post('', auth, upload);
router.delete('', remove);

export default router;