import { Request, Response } from 'express';
import * as authService from '../service/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
     const auth = await authService.login(login, password);
    if (!auth) {
      return res.status(401).json({status: 'failed', message: 'Invalid login or password'});
    }
    res.status(200).json({status: 'success', message: 'User logged in successfully'});
    
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
