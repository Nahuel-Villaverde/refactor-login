import express from 'express';
import { getAllUsers } from '../../controllers/users.view.controller.js';
import { isAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', isAdmin, getAllUsers);

export default router;