import { AppDataSource } from '../../data-source';
import { FriendRequest } from '../../entities/FriendRequest';
import { User } from '../../entities/User';
import { Chat } from '../../entities/Chat';

export class FriendRequestService {
  private friendRequestRepository = AppDataSource.getRepository(FriendRequest);
  private userRepository = AppDataSource.getRepository(User);
  private chatRepository = AppDataSource.getRepository(Chat);

  async sendFriendRequest(senderUid: string, username: string) {
    const sender = await this.userRepository.findOneBy({ uid: senderUid });
    const receiver = await this.userRepository.findOneBy({ username });

    if (!sender || !receiver) {
      throw { statusCode: 404, message: 'User not found' };
    }

    if (sender.id === receiver.id) {
      throw { statusCode: 400, message: 'You cannot send a friend request to yourself' };
    }

    const existingRequest = await this.friendRequestRepository.findOne({
      where: { sender: { id: sender.id }, receiver: { id: receiver.id } },
    });

    if (existingRequest) {
      throw { statusCode: 400, message: 'Friend request already sent' };
    }

    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });

    await this.friendRequestRepository.save(friendRequest);
  }

  async respondToFriendRequest(id: number, status: 'accepted' | 'rejected', receiverUid: string) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id, receiver: { uid: receiverUid } },
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest) {
      throw { statusCode: 404, message: 'Friend request not found' };
    }

    if (status !== 'accepted' && status !== 'rejected') {
      throw { statusCode: 400, message: 'Invalid status' };
    }

    friendRequest.status = status;
    await this.friendRequestRepository.save(friendRequest);

    if (status === 'accepted') {
      const chat = this.chatRepository.create({
        participants: [friendRequest.sender, friendRequest.receiver],
      });
      await this.chatRepository.save(chat);
    }
  }

  async listPendingFriendRequests(receiverUid: string) {
    const requests = await this.friendRequestRepository.find({
      where: { receiver: { uid: receiverUid }, status: 'pending' },
      relations: ['sender'],
    });
    return requests;
  }

  async checkFriendshipStatus(user1Id: string, user2Id: string) {
    const friendRequestRepository = AppDataSource.getRepository(FriendRequest);

    const friendship = await friendRequestRepository.findOne({
      where: [
        { sender: { uid: user1Id as string }, receiver: { uid: user2Id as string }, status: 'accepted' },
        { sender: { uid: user2Id as string }, receiver: { uid: user1Id as string }, status: 'accepted' }
      ]
    });

    return !!friendship;
  }
}
