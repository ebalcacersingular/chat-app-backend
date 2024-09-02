import { AppDataSource } from '../../data-source';
import { Message } from '../../entities/Message';
import { Chat } from '../../entities/Chat';
import { User } from '../../entities/User';

export class MessageService {
  private messageRepository = AppDataSource.getRepository(Message);
  private chatRepository = AppDataSource.getRepository(Chat);
  private userRepository = AppDataSource.getRepository(User);

  async sendMessage(chatId: number, senderUid: string, content: string) {
    const chat = await this.chatRepository.findOneBy({ id: chatId });
    const sender = await this.userRepository.findOneBy({ uid: senderUid });

    if (!chat || !sender) {
      throw { statusCode: 404, message: 'Chat or sender not found' };
    }

    const message = this.messageRepository.create({
      content,
      sender,
      chat,
    });

    return await this.messageRepository.save(message);
  }

  async getChatMessages(chatId: number) {
    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { timestamp: 'ASC' },
    });

    return messages;
  }

  async markMessageAsRead(chatId: number, messageId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, chat: { id: chatId } },
    });

    if (!message) {
      throw { statusCode: 404, message: 'Message not found' };
    }

    message.isRead = true;
    await this.messageRepository.save(message);
  }

  async deleteMessage(chatId: number, messageId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, chat: { id: chatId } },
    });

    if (!message) {
      throw { statusCode: 404, message: 'Message not found' };
    }

    await this.messageRepository.remove(message);
  }
}
