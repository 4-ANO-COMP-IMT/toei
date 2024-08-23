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
		
		checkStrInput(login, 'login');
		checkStrInput(password, 'password');

		const auth = await authService.login(login, password);
		if (!auth) {
			return res.status(401).json({Login: false ,status: 'failed', message: 'Invalid login or password'});
		}

		req.session.login_cookie = login
		req.session.save()
		const session:string = req.sessionID
		if(!req.session.cookie.expires){
			throw new Error('Error getting session expiration date')
		}
		const _expires:Date = req.session.cookie.expires
		await authService.event('UserLogged', {login: login, session: session, _expires: _expires});
		
		console.log('session started by: ',req.session.login_cookie)
		res.status(200).json({Login: true, status: 'success', message: 'User logged in successfully'});
	
	} catch (error) {
		res.status(401).json({Login: false, message: (error as Error).message });
	}
};

export const cookies = async (req: Request, res: Response) => {
	try {
		if(req.session.login_cookie){
			if(!req.session.cookie.expires){
				throw new Error('Error getting session expiration date')
			}
			// resave cookies
			req.session.save()
			const login:string = req.session.login_cookie
			res.status(200).json({valid: true, username: login})
			
			const session:string = req.sessionID
			const _expires:Date=req.session.cookie.expires
			await authService.event('UserLogged', {login, session, _expires});
			return
		}else{
		return res.status(401).json({valid: false})
		}
	} catch (error) {
		res.status(400).json({valid: false, message: (error as Error).message });
	}
};

// Funções de validação

const checkStrInput = (input: string, name: string) => {
	if (!input) {throw new MissingParameters(name);}
	if (typeof input !== 'string') {throw new WrongTypeParameters(name);}
	if (input.trim() === "") {throw new Invalid(name);} 
}
