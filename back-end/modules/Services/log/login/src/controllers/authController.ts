import { Request, Response } from 'express';
import * as authService from '../service/authService';

declare module 'express-session' {
  interface SessionData {
    username: string;
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
     const auth = await authService.login(login, password);
    if (!auth) {
      return res.status(401).json({Login: false ,status: 'failed', message: 'Invalid login or password'});
    }
    req.session.username = login
    console.log('session set [login]: ',req.session.username)
    res.status(200).json({Login: true, status: 'success', message: 'User logged in successfully'});
    
  } catch (error) {
    res.status(401).json({Login: false, message: (error as Error).message });
  }
};


export const cookies = async (req: Request, res: Response) => {
  try {
    console.log('session set [cookies]: ',req.session.username)
    if(req.session.username){
      return res.status(200).json({valid: true, username: req.session.username})
    }else{
      return res.status(401).json({valid: false})
    }
  
  } catch (error) {
    res.status(400).json({valid: false, message: (error as Error).message });
  }
};
