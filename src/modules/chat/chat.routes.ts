import express from 'express';
import { createChat, getUserChats, getChatDetails } from './chat.controller';
import { verifyToken } from '../../middleware/auth';

const router = express.Router();

router.post('/', verifyToken, createChat);
router.get('/', verifyToken, getUserChats);
router.get('/:chatId', verifyToken, getChatDetails);

export default router;
