import { Request, Response } from 'express';
import { ChatService } from './chat.service';

const chatService = new ChatService();

export const createChat = async (req: Request, res: Response) => {
  const authUserUid = (req as any).user.uid;
  const { userUid } = req.body;

  try {
    const chat = await chatService.createChat(authUserUid, userUid);
    res.status(201).json({ chatId: chat.id, message: 'Chat created successfully.' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  const userUid = (req as any).user.uid;

  try {
    const chats = await chatService.getUserChats(userUid);
    res.status(200).json(chats);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getChatDetails = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const chat = await chatService.getChatDetails(Number(chatId));
    res.status(200).json(chat);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
