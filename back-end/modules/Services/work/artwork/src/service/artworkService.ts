import { IArtwork, ArtworksModel } from '../models/artworks';
import { ISession, ICookieConfig, SessionModel } from '../models/sessions';
import axios from 'axios';

export const startArtworks = async (login:String) => {
    const authArtworks = new ArtworksModel({login, artworks: []});
    authArtworks.save().catch(err => console.error(err.message));
}

export const createArtwork =  (login:String, artwork:IArtwork) => {
    ArtworksModel.updateOne(
        {login}, 
        {
            $push: {
                artworks: [artwork]
            }
        }
    ).catch(err => console.error(err.message));
    return artwork;
}


export const readArtwork =  async (login:String, position:number) => {
    console.log("Login:",login);
    const artwork_found = await ArtworksModel.find(
        {
            login,
            [`artworks.${position}`]: {$exists: true}
        },
        { "artworks": { $slice: [ position, 1 ] } }
    ).catch(err => console.error(err.message));
    return artwork_found;
}

export const updateArtwork =  async (login:String, position:number, artwork:IArtwork) => {
    const artwork_updated = await ArtworksModel.updateOne(
        {
            login,
            [`artworks.${position}`]: {$exists: true}
        },
        {
            $set: {[`artworks.${position}`]: artwork }
        }
    ).catch((err) => {
        console.log('Failed to update artwork in database \n%s',err)
    });
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