import express from 'express';
import { toggleUserRoleController } from '../../controllers/users.controller.js';

const router = express.Router();

router.put('/premium/:userId', toggleUserRoleController);

export default router;
