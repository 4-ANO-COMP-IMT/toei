import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';
import { ICookieConfig } from '../models/sessions';

declare module 'express-session' {
	interface SessionData {
		login_cookie: string;
		ip_cookie: string;
	}
}

export const login = async (req: Request, res: Response) => {
  	try {
		const { login, password } = req.body;
		checkStrInput(login, 'login');
		checkStrInput(password, 'password');

		const auth = await authService.checkLogin(login, password);
		if (!auth) {
			return res.status(401).json({logged: false , message: 'Invalid login or password'});
		}
		// create new session and save cookie on browser, or rewrite if already exists
		
		// console.log('session: ',req.session)
		req.session.login_cookie = login
		req.session.ip_cookie = req.ip
		req.session.save();

		res.status(200).json({logged: true, message: 'User logged in successfully'});
		console.log('login by: ',login)

		const cookie_config = cookieConfig(req)
		await authService.event('UserLogged', {cookie_config});	
	} catch (err) {
		res.status(401).json({logged: false, message: (err as Error).message });
	}
};

export const check_session = async (req: Request, res: Response) => {
	try{
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
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

export const disconnect = async (req: Request, res: Response) => {
	try {
		if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
			return res.status(401).json({disconnected:false, message: 'User not logged in'});
		}
		
		const cookie_config = cookieConfig(req)
		authService.event('UserDisconnected', {cookie_config});

		req.session.destroy((err) => {
			if (err) {
				return res.status(500).json({disconnected:false, message: err});
			}
		})
		res.status(200).json({disconnected:true, message: 'User logged out'});
	} catch (err) {
		res.status(400).json({disconnected:false, message: (err as Error).message });
	}
}

const cookieConfig = (req:Request) => {
	const login:string = req.session.login_cookie as string
	const session:string = req.sessionID
	const _expires:Date=req.session.cookie.expires as Date
	const maxAge:number = req.session.cookie.originalMaxAge as number
    const ip_cookie:string = req.session.ip_cookie as string

	const cookieConfig:ICookieConfig = {login, session, _expires, maxAge, ip_cookie}
	return cookieConfig
}

// Funções de validação

const checkStrInput = (input: string, name: string) => {
	if (!input) {throw new MissingParameters(name);}
	if (typeof input !== 'string') {throw new WrongTypeParameters(name);}
	if (input.trim() === "") {throw new Invalid(name);} 
}
