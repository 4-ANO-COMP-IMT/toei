import { UserModel, IUser } from '../models/user';
import { ISession, ICookieConfig, SessionModel } from '../models/sessions';
import bcrypt from 'bcrypt';
import axios from 'axios';


export const createUser =  (user:IUser) => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;
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
        {$set: { 
            name: user.name,
            birthDate: user.birthDate,
            password: user.password,
            email: user.email
         }}
    ).catch(err => console.error(err.message));
    return artwork_updated;
}

export const deleteUser =  async (login:String) => {
    const artwork_deleted = await UserModel.deleteOne(
        {login}
    ).catch(err => console.error(err.message));
    return artwork_deleted;
}

export const event = async ( typeMessage: string, payloadMessage: any ) => {
    axios.post('http://localhost:10000/event', {
        type: typeMessage,
        payload: payloadMessage
    }).catch((err) => {
        console.log(`Failed to send ${typeMessage} event`,err)
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
    SessionModel.findOneAndUpdate(
        { _id: session }, newSession, { upsert: true }
    ).catch(err => console.error(err.message));
}