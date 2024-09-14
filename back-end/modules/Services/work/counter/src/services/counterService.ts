import { IArtwork, ArtworksModel, ICounter } from '../models/counter';
import { ISessions, ICookieConfig, SessionsModel } from '../models/sessions';
import axios from 'axios';
import { IUserChanges } from '../models/events';

export const readArtwork = async (id: string, login :string, position: number) => {
    const counter = await ArtworksModel.findOne({_id: id, login},{'artwork.counters':{$slice: [position,1]}});
    return counter;
}

export const updateCounter = async (login:string, id:string, position:number, value:number) => {
    const artwork_updated = await ArtworksModel.updateOne(
        {_id:id, login},
        {$set:
            { [`artwork.counters.${position}.value`]: value }
        }
    );
    return artwork_updated;
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

export const createArtwork = async (id:String, login:String, artwork:IArtwork) => {
    const {counters}=artwork;
    const artwork_created = new ArtworksModel({_id:id, login:login, artwork:{counters}});
    artwork_created.save();
    return artwork_created;
}

export const updateArtwork =  async (id:String, login:string, counters:ICounter[]) => {
    const artwork_updated = await ArtworksModel.updateOne({_id:id, login},{$set: { artwork: {counters} }});
    return artwork_updated;
}

export const deleteArtwork =  async (login:String, id:string) => {
    const artwork_deleted = await ArtworksModel.deleteOne({_id:id, login});
    return artwork_deleted;
}
