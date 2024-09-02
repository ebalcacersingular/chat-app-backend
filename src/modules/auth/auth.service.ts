import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async registerUser(email: string, username: string, password: string) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw { statusCode: 400, message: 'Email or username already in use.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ email, username, password: hashedPassword });

    await this.userRepository.save(newUser);

    return { message: 'User registered successfully.' };
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        username: user.username,
      },
    }
  }
}
