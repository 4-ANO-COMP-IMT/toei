import { UserModel, IUser } from '../models/user';
import { ISessions, ICookieConfig, SessionsModel } from '../models/sessions';
import axios from 'axios';
import { config } from '../config/config';

export const createUser =  (user:IUser) => {
    const newUser = new UserModel(user);
    newUser.save();
    return newUser;
};

export const readUser = async (login:string) => {
    const user = await UserModel.findOne({login : login});
    if(!user){
        throw new Error('User not found');
    }
    return user;
}

export const updateUser =  async (login:string, user:IUser) => {
    const artwork_updated = await UserModel.updateOne(
        {login},
        {$set: user}
    )
    return artwork_updated;
}

export const deleteUser =  async (login:String) => {
    const artwork_deleted = await UserModel.deleteOne(
        {login}
    );
    return artwork_deleted;
}

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
        "_id": session,
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
        console.log(err);
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