import bcrypt from 'bcrypt';
import { UserLogin } from '../models/userLogin';
import axios from 'axios';
import { ISession, ICookieConfig, SessionModel } from '../models/sessions';

export const startUser = async (login: string, password: string) => {
	const authLogin = new UserLogin({login, password});
	console.log(authLogin)
	authLogin.save().catch(err => console.error(err.message));
}

export const login = async (login: string, password: string) => {
    const userLogin = await UserLogin.findOne({login: login});
    if (!userLogin || !(await bcrypt.compare(password, userLogin?.password || ''))){
        return false;
    }
        return true;
};

export const event = async ( typeMessage: string, payloadMessage: any ) => {
  	axios.post('http://localhost:10000/event', {
		type: typeMessage,
		payload: payloadMessage
	}).catch((err) => {
		console.log(`Failed to send ${typeMessage} event:`,err.message)
	});
}

export const updateCookie = async (cookie_config: ICookieConfig) => {
    const {login, session, _expires, maxAge} = cookie_config;
    const expires:Date = new Date(_expires);
    const newSession : ISession ={
        "_id": session,
        "expires": expires,
        "session":`{"cookie":{"originalMaxAge":${maxAge},"expires":"${expires.toISOString()}","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"login_cookie":"${login}"}`
    };
    SessionModel.findOneAndUpdate({ _id: session }, newSession, { upsert: true }).
    catch(err => console.error(err.message));
}