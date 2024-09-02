import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const registerUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    const newUser = await authService.registerUser(email, username, password);
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const results = await authService.loginUser(email, password);
    res.status(200).json(results);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
