import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';

declare module 'express-session' {
	interface SessionData {
		login_cookie: string;
	}
}

export const login = async (req: Request, res: Response) => {
  	try {
		const { login, password } = req.body;
		
		checkStrInput(login, 'login');
		checkStrInput(password, 'password');

		const auth = await authService.login(login, password);
		if (!auth) {
			return res.status(401).json({logged: false , message: 'Invalid login or password'});
		}
		
		req.session.login_cookie = login

		res.status(200).json({logged: true, message: 'User logged in successfully'});
		
		const cookie_config = cookieConfig(req)
		await authService.event('UserLogged', {cookie_config});	
	} catch (err) {
		res.status(401).json({logged: false, message: (err as Error).message });
	}
};

export const cookies = async (req: Request, res: Response) => {
	try{
        if(!req.session.login_cookie){
            return res.status(401).json({ valid: false, message: 'User not logged in' });
        }
		const login:string = req.session.login_cookie

		res.status(200).json({valid: true, username: login, message: 'User logged in'});
		console.log('session check by: ',req.session.login_cookie)
		
		const cookie_config = cookieConfig(req)
		await authService.event('UserLogged', {cookie_config});
	} catch (err) {
		res.status(400).json({valid: false, message: (err as Error).message });
	}
};

// Funções de validação

const checkStrInput = (input: string, name: string) => {
	if (!input) {throw new MissingParameters(name);}
	if (typeof input !== 'string') {throw new WrongTypeParameters(name);}
	if (input.trim() === "") {throw new Invalid(name);} 
}

const cookieConfig = (req:Request) => {
	const login:string = req.session.login_cookie as string
	const session:string = req.sessionID
	const _expires:Date=req.session.cookie.expires as Date
	// console.log("expires:",_expires)
	const maxAge:number = req.session.cookie.originalMaxAge as number
	const cookieConfig = {login, session, _expires, maxAge}
	return cookieConfig
}
