import { Router } from 'express';
import { getAllMessagesApi, createMessage, updateMessage, deleteMessage } from '../../controllers/message.controller.js';

const router = Router();

router.get('/', getAllMessagesApi);
router.post('/', createMessage);
router.put('/:uid', updateMessage);
router.delete('/:uid', deleteMessage);

export default router;
