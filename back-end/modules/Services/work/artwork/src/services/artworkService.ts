import { IArtwork, ArtworksModel } from '../models/artworks';
import { ISession, ICookieConfig, SessionModel } from '../models/sessions';
import { Types } from 'mongoose';
import axios from 'axios';

export const createArtwork =  (login:String, artwork:IArtwork) => {
    const artwork_created = new ArtworksModel({login, artwork});
    artwork_created.save().catch(err => console.error(err.message));
    return artwork_created;
}

export const readArtwork =  async (login:string, id:string) => {
    const _id = new Types.ObjectId(id);
    const artwork_read = await ArtworksModel.find(
        {_id, login}
    ).catch(err => console.error(err.message));
    return artwork_read;
}

export const updateArtwork =  async (login:string, id:string, artwork:IArtwork) => {
    const _id = new Types.ObjectId(id);
    const artwork_updated = await ArtworksModel.updateOne(
        {_id, login},
        {$set: { artwork }}
    ).catch(err => console.error(err.message));
    return artwork_updated;
}

export const deleteArtwork =  async (login:String, id:string) => {
    const _id = new Types.ObjectId(id);
    const artwork_deleted = await ArtworksModel.deleteOne(
        {_id, login}
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