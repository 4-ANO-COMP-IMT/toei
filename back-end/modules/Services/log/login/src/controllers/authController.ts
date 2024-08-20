import { Request, Response } from 'express';
import * as authService from '../service/authService';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';

declare module 'express-session' {
  interface SessionData {
    login_cookie: string;
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    if (!login) {throw new MissingParameters('login');}
    if (typeof login !== 'string') {throw new WrongTypeParameters('login');}
    if (login.trim() === "") {throw new Invalid('login');}

    if (!password) {throw new MissingParameters('password');}
    if (typeof password !== 'string') {throw new WrongTypeParameters('password');}
    if (password.trim() === "") {throw new Invalid('password');}

    const auth = await authService.login(login, password);
    if (!auth) {
      return res.status(401).json({Login: false ,status: 'failed', message: 'Invalid login or password'});
    }
    req.session.login_cookie = login
    console.log('session set [login]: ',req.session.login_cookie)
    res.status(200).json({Login: true, status: 'success', message: 'User logged in successfully'});
    
  } catch (error) {
    res.status(401).json({Login: false, message: (error as Error).message });
  }
};


export const cookies = async (req: Request, res: Response) => {
  try {
    console.log('session set [cookies]: ',req.session.login_cookie)
    if(req.session.login_cookie){
      return res.status(200).json({valid: true, username: req.session.login_cookie})
    }else{
      return res.status(401).json({valid: false})
    }
  
  } catch (error) {
    res.status(400).json({valid: false, message: (error as Error).message });
  }
};
