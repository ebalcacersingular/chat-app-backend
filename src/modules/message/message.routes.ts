import express from 'express';
import { sendMessage, getChatMessages, markMessageAsRead, deleteMessage } from './message.controller';
import { verifyToken } from '../../middleware/auth';

const router = express.Router();

router.post('/:chatId/messages', verifyToken, sendMessage);
router.get('/:chatId/messages', verifyToken, getChatMessages);
router.patch('/:chatId/messages/:messageId/read', verifyToken, markMessageAsRead);
router.delete('/:chatId/messages/:messageId', verifyToken, deleteMessage);

export default router;
