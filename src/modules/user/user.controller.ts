import { Request, Response } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export const getUserDetails = async (req: Request, res: Response) => {
  const userUid = (req as any).user.uid;

  try {
    const user = await userService.getUserDetails(userUid);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userUid = (req as any).user.uid;
  const { email, username } = req.body;

  try {
    await userService.updateUserProfile(userUid, { email, username });
    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
