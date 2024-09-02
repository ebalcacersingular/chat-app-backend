import { Request, Response } from 'express';
import { MessageService } from './message.service';

const messageService = new MessageService();

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { content } = req.body;
  const senderUid = (req as any).user.uid;

  try {
    const message = await messageService.sendMessage(Number(chatId), senderUid, content);
    res.status(201).json({ messageId: message.id, message: 'Message sent successfully.' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const messages = await messageService.getChatMessages(Number(chatId));
    res.status(200).json(messages);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  const { chatId, messageId } = req.params;

  try {
    await messageService.markMessageAsRead(Number(chatId), Number(messageId));
    res.status(200).json({ message: 'Message marked as read.' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { chatId, messageId } = req.params;

  try {
    await messageService.deleteMessage(Number(chatId), Number(messageId));
    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
