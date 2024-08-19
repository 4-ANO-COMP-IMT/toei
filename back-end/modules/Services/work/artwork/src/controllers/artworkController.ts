import { Request, Response } from 'express';
import * as artworkService from '../service/artworkService';
import { MissingParameters, WrongTypeParameters } from './errorsController';

declare module 'express-session' {
    interface SessionData {
      login_cookie: string;
    }
}

export const create_artwork = async (req: Request, res: Response) => {
    try {
        if(req.session.login_cookie){
            console.log('session set [cookies]: ',req.session.login_cookie)
            const { artwork } = req.body;
            const login = req.session.login_cookie;
            
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
        }else{
            res.status(401).json({ message: 'User not logged in' });
        }

    } catch (error) {

        res.status(400).json({ message: (error as Error).message });
    }
}


export const read_artwork = async (req: Request, res: Response) => {
    try{
        console.log('session set [cookies]: ',req.session.login_cookie)
        if(req.session.login_cookie){
            const login = req.session.login_cookie;
            
            const position:number = Number(req.params.position);
            
            const artworkRead = await artworkService.readArtwork(login, position);

            res.status(200).json({ artworkRead });
        }else{
            res.status(401).json({ message: 'User not logged in' });
        }
    }
    catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }

}