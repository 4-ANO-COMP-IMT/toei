import { IArtwork, ArtworksModel } from '../models/artworks';
import axios from 'axios';

export const createArtwork =  (login:String, artwork:IArtwork) => {
    ArtworksModel.updateOne(
        {login}, 
        {
            $push: {
                artworks: [artwork]
            }
        }
    ).catch((err) => {
        console.log('Failed to add artwork to database \n%s',err)
    });
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
    ).catch((err) => {
        console.log('Failed to read artwork from database \n%s',err)
    });
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