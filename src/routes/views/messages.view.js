import { Router } from 'express';
import { getAllMessages } from '../../controllers/message.controller.js';
import { isAuthenticated } from '../../middleware/auth.js';

const router = Router();

router.use(isAuthenticated);

router.get('/', getAllMessages);

export default router;
