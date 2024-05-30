import { Request, Response } from 'express';
import * as authService from '../service/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    const token = await authService.login(login, password);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
