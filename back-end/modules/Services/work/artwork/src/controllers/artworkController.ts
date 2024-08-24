import { Request, Response } from 'express';
import * as artworkService from '../service/artworkService';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';
import { IArtwork } from '../models/artworks';

declare module 'express-session' {
    interface SessionData {
      login_cookie: string;
    }
}

export const create_artwork = async (req: Request, res: Response) => {
    try {
        if(req.session.login_cookie){

            const login = req.session.login_cookie;
        const artwork:IArtwork = req.body.artwork;
            checkArtwork(artwork);

            const artworkCreated = await artworkService.createArtwork(login, artwork);
            artworkService.event('ArtworkCreated', {login, artwork});
            console.log("Artwork created by: ",login);
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
        if(req.session.login_cookie){

            const login = req.session.login_cookie;
            checkStr(login, 'login');

            const position = Number(req.params.position);
            checkPosition(position);
            
            const artworkRead = await artworkService.readArtwork(login, position);
            artworkService.event('ArtworkRead', {login, position, artwork: artworkRead});
            console.log("Artwork read by: ",login);
            res.status(200).json({ artworkRead });
        }else{
            res.status(401).json({ message: 'User not logged in' });
        }
    }
    catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}

export const update_artwork = async (req: Request, res: Response) => {
    try{
        if(req.session.login_cookie){

            const login = req.session.login_cookie;
            checkStr(login, 'login');

        const artwork:IArtwork = req.body.artwork;
            checkArtwork(artwork);

            const position = Number(req.params.position);
            checkPosition(position);

            const artworkUpdated = await artworkService.updateArtwork(login, position, artwork);
            artworkService.event('ArtworkUpdated', {login, position, artwork: artworkUpdated});
            console.log("Artwork updated by: ",login);
            res.status(200).json({ artworkUpdated });
        }else{
            res.status(401).json({ message: 'User not logged in' });
        }
    }
    catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}

// funções de validação

const checkStr = (input: string, name: string) => {
  if (!input) {throw new MissingParameters(name);}
  if (typeof input !== 'string') {throw new WrongTypeParameters(name);}
  if (input.trim() === "") {throw new Invalid(name);} 
}

 const checkArtwork = (artwork:IArtwork) => {
    if (!artwork) {throw new MissingParameters('artwork');
    }else{
        if(!artwork.hasOwnProperty('title')){throw new MissingParameters('title');}
        if(typeof artwork.title !== 'string'){throw new WrongTypeParameters('title');}
        if(artwork.title.trim() === ""){throw new Invalid('title');}

        if(!artwork.hasOwnProperty('description')){throw new MissingParameters('description');}
        if(typeof artwork.description !== 'string'){throw new WrongTypeParameters('description');}

        if(!artwork.hasOwnProperty('counters')){throw new MissingParameters('counters');}
        if(typeof  artwork.counters !== 'object'){throw new WrongTypeParameters('counters');}
        else{
            artwork.counters.forEach(element => {
                if(!element.hasOwnProperty('name')){throw new MissingParameters('counter_name');}
                if(typeof element.name !== 'string'){throw new WrongTypeParameters('counter_name');}
                if(element.name.trim() === ""){throw new Invalid('counter_name');}
                if(!element.hasOwnProperty('value')){throw new MissingParameters('counter_value');}
                if(isNaN(element.value) || !Number.isInteger(element.value)){throw new WrongTypeParameters('counter_value');}
                if(element.value < 0 || element.value > element.maxValue){throw new Invalid('counter_value');}
                if(!element.hasOwnProperty('maxValue')){throw new MissingParameters('counter_maxvalue');}
                if(isNaN(element.maxValue) || !Number.isInteger(element.maxValue)){throw new WrongTypeParameters('counter_maxvalue');}
                if(element.maxValue < 0){throw new Invalid('counter_maxvalue');}
            });
        }

        if(!artwork.hasOwnProperty('tags')){throw new MissingParameters('tags');}
        if(typeof artwork.tags !== 'object'){throw new WrongTypeParameters('tags');}
        artwork.tags.forEach(element => {
            if(typeof element !== 'string'){throw new WrongTypeParameters('tag');}
            if(element.trim() === "" || element.length > 20){throw new Invalid('tag');}
        });

        if(!artwork.hasOwnProperty('informations')){throw new MissingParameters('informations');}
        if(typeof artwork.informations !== 'object'){throw new WrongTypeParameters('informations');}
        artwork.informations.forEach(element => {
            if(!element.hasOwnProperty('name')){throw new MissingParameters('info_name');}
            if(typeof element.name !== 'string'){throw new WrongTypeParameters('info_name');}
            if(element.name.trim() === ""){throw new Invalid('info_name');}

            if(!element.hasOwnProperty('content')){throw new MissingParameters('info_content');}
            if(typeof element.content !== 'string'){throw new WrongTypeParameters('info_content');}
            if(element.content.trim() === ""){throw new Invalid('info_content');}
        });
        if(!artwork.hasOwnProperty('img')){throw new MissingParameters('image');}
    }
}

const checkPosition = (position: number) => {
    if(!position && position != 0){throw new MissingParameters('position');}
    if (isNaN(position) || !Number.isInteger(position)) {throw new WrongTypeParameters('position');}
    if (position < 0) {throw new Invalid('position');}
}
