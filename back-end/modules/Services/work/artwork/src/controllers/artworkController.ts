import { Request, Response } from 'express';
import * as artworkService from '../service/artworkService';
import { MissingParameters, WrongTypeParameters } from './errorsController';
import { Artwork } from '../models/artworks';

export const create_artwork = async (req: Request, res: Response) => {
        
    try {
        const { login, artwork } = req.body;
        
        if (!login) {
            throw new MissingParameters('login');
            
        }
        if (!artwork) {
            throw new MissingParameters('artwork');
            
        }else{
            if(!artwork.title){
                throw new MissingParameters('title');
            }
            if(!artwork.description){
                throw new MissingParameters('description');
            }
            if(!artwork.counters){
                throw new MissingParameters('counters');
            }
            if(!artwork.informations){
                throw new MissingParameters('informations');
            }
            if(!artwork.img){
                throw new MissingParameters('image');
            }
        }
        console.log("Login:",login);
        console.log("Artwork:",artwork);

        const artworkCreated = artworkService.createArtwork(login, artwork);
        
        res.status(201).json({ artworkCreated });

    } catch (error) {

        res.status(400).json({ message: (error as Error).message });
    }
}


export const read_artwork = async (req: Request, res: Response) => {

    try{
        const { login } = req.body;
        if (!login) {
            throw new MissingParameters('login');
        }
        const position:number = Number(req.params.position);
        
        const artworkRead = await artworkService.readArtwork(login, position);

        res.status(200).json({ artworkRead });
    }
    catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }

}