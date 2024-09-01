import { IArtwork, ArtworksModel } from '../models/artworks';
import { ISessions, ICookieConfig, SessionsModel } from '../models/sessions';
import axios from 'axios';
import { IUserChanges } from '../models/events';

export const readArtworks = async (login:String,title:String,tags:String[],filters:String[],sort:String,order:Boolean) => {
    const filter =
    tags.length != 0?
        filters.length != 0?
            {login,'artwork.title':{$regex: `${title}`, '$options' : 'i'},'artwork.tags': { $all: tags, $nin: filters}}:
            {login,'artwork.title':{$regex: `${title}`, '$options' : 'i'},'artwork.tags': { $all: tags}}:
        filters.length != 0?
            {login,'artwork.title':{$regex: `${title}`, '$options' : 'i'},'artwork.tags': { $nin: filters}}:
            {login,'artwork.title':{$regex: `${title}`, '$options' : 'i'}}

    const artworks = await ArtworksModel.find(filter)
    .sort({[`${sort}`]: order ? 1 : -1})
    .catch((err) => {
        console.log('Failed to read artworks from database \n%s',err)
    });
    return artworks;
}

export const readTags = async (login:String) => {
    const tags = await ArtworksModel.aggregate([
        {"$unwind": "$artwork.tags",
        },
        {
            $match: {
                login: login
            }
        },
        {
            $group: {
                _id: null,
                tags: {"$addToSet": "$artwork.tags"}
            }
        }
    ]).catch((err) => {
        console.log('Failed to read tags from database \n%s',err)
    });
    return tags;
}

export const event = async ( typeMessage: string, payloadMessage: any ) => {
    axios.post('http://localhost:10000/event', {
        type: typeMessage,
        payload: payloadMessage
    }).catch((err) => {
        console.log(`Failed to send ${typeMessage} event`,err)
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

export const createArtwork = async (id:String, login:String, artwork:IArtwork) => {
    const artwork_created = new ArtworksModel({_id:id, login:login, artwork:artwork});
    artwork_created.save();
    return artwork_created;
}

export const updateArtwork =  async (id:String, login:string, artwork:IArtwork) => {
    const artwork_updated = await ArtworksModel.updateOne({_id:id, login},{$set: { artwork }});
    return artwork_updated;
}

export const deleteArtwork =  async (login:String, id:string) => {
    const artwork_deleted = await ArtworksModel.deleteOne({_id:id, login});
    return artwork_deleted;
}

export const updateCounter = async (login:string, id:string, value:number) => {
    const artwork_updated = await ArtworksModel.updateOne({_id:id, login},{$set: { [`artwork.counter.value`]: value }});
    return artwork_updated;
}