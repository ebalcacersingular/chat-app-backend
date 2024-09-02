import { AppDataSource } from '../../data-source';
import { FriendRequest } from '../../entities/FriendRequest';
import { Chat } from '../../entities/Chat';
import { User } from '../../entities/User';

export class ChatService {
  private chatRepository = AppDataSource.getRepository(Chat);
  private userRepository = AppDataSource.getRepository(User);
  private friendRequestRepository = AppDataSource.getRepository(FriendRequest);

  async createChat(user1Id: string, user2Id: string) {
    const friendship = await this.friendRequestRepository.findOne({
      where: [
        { sender: { uid: user1Id }, receiver: { uid: user2Id }, status: 'accepted' },
        { sender: { uid: user2Id }, receiver: { uid: user1Id }, status: 'accepted' }
      ]
    });

    if (!friendship) {
      throw { statusCode: 403, message: 'Users are not friends' };
    }

    const existingChat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoin('chat.participants', 'participant')
      .where('participant.uid IN (:...userIds)', { userIds: [user1Id, user2Id] })
      .groupBy('chat.id')
      .having('COUNT(DISTINCT participant.uid) = 2')
      .getOne();

    if (existingChat) {
      throw { statusCode: 409, message: 'Chat already exists' };
    }

    const user1 = await this.userRepository.findOneBy({ uid: user1Id });
    const user2 = await this.userRepository.findOneBy({ uid: user2Id });

    if (!user1 || !user2) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const newChat = this.chatRepository.create();
    newChat.participants = [user1, user2];
    await this.chatRepository.save(newChat);

    return newChat
  }

  async getUserChats(userUid: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.uid = :userUid', { userUid })
      .getOne();

    if (!user) {
      console.log('User not found for uid:', userUid);
      return [];
    }

    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('chat.messages', 'message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('chat.id IN (SELECT "chatsId" FROM "chats_participants_users" WHERE "usersId" = :userId)', { userId: user.id })
      .orderBy('message.timestamp', 'DESC')
      .select([
        'chat.id',
        'chat.createdAt',
        'chat.updatedAt',
        'participant.uid',
        'participant.email',
        'participant.username',
        'message.id',
        'message.content',
        'message.isRead',
        'message.timestamp',
        'sender.username',
      ])
      .getMany();

    const chatsWithLastMessage = chats.map((chat) => {
      const lastMessage = chat.messages.length ? chat.messages[0] : null;
      return {
        ...chat,
        lastMessage,
      };
    });

    return chatsWithLastMessage;
  }


  async getChatDetails(chatId: number) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'messages', 'messages.sender'],
    });

    if (!chat) {
      throw { statusCode: 404, message: 'Chat not found' };
    }

    return chat;
  }
}
