import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserDetails(userUid: string) {
    const user = await this.userRepository.findOneBy({ uid: userUid });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    return {
      uid: user.uid,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUserProfile(userUid: string, updates: Partial<User>) {
    const user = await this.userRepository.findOneBy({ uid: userUid });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    if (updates.email) user.email = updates.email;
    if (updates.username) user.username = updates.username;

    await this.userRepository.save(user);
  }
}
