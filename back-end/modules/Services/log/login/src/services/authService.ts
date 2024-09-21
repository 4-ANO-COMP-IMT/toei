import bcrypt from 'bcrypt';
import { UserLogin } from '../models/userLogin';
import axios from 'axios';
import { ISessions, ICookieConfig, SessionsModel } from '../models/sessions'
import { IUserChanges } from '../models/events';
import {config} from '../config/config';

export const createLogin = async (login: string, password: string) => {
	const authLogin = new UserLogin({login, password});
	await authLogin.save();
}

export const updateLogin = async (userChanges:IUserChanges) => {
    if (!userChanges){
        return false;
    }
    const {oldLogin, newLogin, newPassword} = userChanges;
    const userLogin = await UserLogin.findOne({login: oldLogin});
    if (!userLogin){
        return false;
    }
    userLogin.login = newLogin as string;
    userLogin.password = newPassword as string;
    await userLogin.save();
    return true;
}

export const deleteLogin = async (login:string) => {
    const userLogin = await UserLogin.deleteOne({login});
    if (!userLogin){
        return false;
    }
    return true;
}

export const checkLogin = async (login: string, password: string) => {
    const userLogin = await UserLogin.findOne({login: login});
    if (!userLogin || !(await bcrypt.compare(password, userLogin?.password || ''))){
        return false;
    }
    return true;
};

export const event = async ( typeMessage: string, payloadMessage: any ) => {
  	axios.post(`${config.bridgeUrl}/event`, {
		type: typeMessage,
		payload: payloadMessage
	});
}

export const updateSession = async (cookie_config: ICookieConfig) => {
    const {login, session, _expires, maxAge, ip_cookie} = cookie_config;
    const expires:Date = new Date(_expires);
    const newSession : ISessions ={
        _id: session,
        "expires": expires,
        "session":{
            "cookie":{
                "originalMaxAge":maxAge,
                "partitioned":false,
                "priority":"medium",
                "expires":expires.toISOString(),
                "secure":false,
                "httpOnly":true,
                "domain":"localhost",
                "path":"/",
                "sameSite":"lax"
            },
            "login_cookie":login,
            "ip_cookie":ip_cookie
        }
    };
    SessionsModel.findOneAndUpdate(
        {_id: session}, newSession, {upsert: true}
    ).catch((err) => {
        console.log((err as Error).message);
    });
}

export const deleteSession = async (id:string) => {
    const session_deleted = await SessionsModel.deleteOne(
        {
            '_id': id
        }
    );
    return session_deleted;
}

export const deleteSessions = async (login:string) => {
    const session_deleted = await SessionsModel.deleteMany(
        {
            'session.login_cookie': login
        }
    );
    return session_deleted;
}