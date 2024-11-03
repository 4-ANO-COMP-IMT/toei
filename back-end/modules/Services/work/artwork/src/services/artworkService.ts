import { IArtwork, ArtworksModel } from '../models/artworks';
import { ISessions, ICookieConfig, SessionsModel } from '../models/sessions';
import { IUserChanges } from '../models/events';
import axios from 'axios';
import { config } from '../config/config';

export const createArtwork =  (login:String, artwork:IArtwork) => {
    const artwork_created = new ArtworksModel({login, artwork});
    artwork_created.save();
    return artwork_created;
}

export const readArtwork =  async (login:string, id:string) => {
    const artwork_read = await ArtworksModel.find({_id:id, login});
    return artwork_read;
}

export const updateArtwork =  async (login:string, id:string, artwork:IArtwork) => {
    const artwork_updated = await ArtworksModel.updateOne({_id:id, login},{$set: { artwork }});
    return artwork_updated;
}

export const deleteArtwork =  async (login:String, id:string) => {
    const artwork_deleted = await ArtworksModel.deleteOne({_id:id, login});
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

export const deleteSessions = async (login:String) => {
    console.log(login);
    const session_deleted = await SessionsModel.deleteMany(
        {
            'session.login_cookie': login
        }
    );
    console.log(session_deleted);
    return session_deleted;
}

export const updateArtworks = async ( userChanges:IUserChanges) => {
    const artwork_updated = await ArtworksModel.updateMany
    ({login: userChanges.oldLogin},{$set: { login: userChanges.newLogin }});
    return artwork_updated;
}

export const deleteArtworks = async (login:String) => {
    const artwork_deleted = await ArtworksModel.deleteMany({login});
    return artwork_deleted;
}

export const updateCounter = async (login:string, id:string, position:number, value:number) => {
    const artwork_updated = await ArtworksModel.updateOne({_id:id, login},{$set: { [`artwork.counters.${position}.value`]: value }});
    return artwork_updated;
}