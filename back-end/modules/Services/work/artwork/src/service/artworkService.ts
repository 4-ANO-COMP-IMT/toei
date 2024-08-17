import { ArtworksModel, Artwork, Artworks } from '../models/artworks';
import axios from 'axios';

//criar artwork a partir do modelo
export const createArtwork =  (login:String, artwork:Artwork) => {
    // adicionar a artwork no mongodb
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

    axios.post('http://localhost:10000/event', {
        type: 'ArtworkCreated',
        payload: {
            login,
            artwork
        }
    }).catch((err) => {
        console.log('Failed to send ArtworkCreated event \n%s',err)
    });
    return artwork;
}


export const readArtwork =  async (login:String, position:number) => {
    console.log("Login:",login);
    const artwork_found = await ArtworksModel.find(
        {login},
        { "artworks": { $slice: [ position, 1 ] } }
    ).catch((err) => {
        console.log('Failed to read artwork from database \n%s',err)
    });

    axios.post('http://localhost:10000/event', {
        type: 'ArtworkRead',
        payload: {
            login,
            position,
            artwork: artwork_found
        }
    }).catch((err) => {
        console.log('Failed to send ArtworkRead event \n%s',err)
    });

    return artwork_found;
}
