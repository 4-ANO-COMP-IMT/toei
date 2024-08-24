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
        if(!req.session.login_cookie){
            return res.status(401).json({ message: 'User not logged in' });
        }
        const login = req.session.login_cookie;
        const artwork:IArtwork = req.body.artwork;
        checkArtwork(artwork);

        const artworkCreated = await artworkService.createArtwork(login, artwork);

        res.status(201).json({ artworkCreated, message:'Artwork created successfully' });
        console.log("Artwork created by:",login);

		const cookie_config = cookieConfig(req)
        artworkService.event('ArtworkCreated', {login, artwork, cookie_config});
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
}

export const read_artwork = async (req: Request, res: Response) => {
    try{
        if(!req.session.login_cookie){
            return res.status(401).json({ message: 'User not logged in' });
        }
        const login = req.session.login_cookie as string;
        checkStr(login, 'login');
        const position = Number(req.params.position);
        checkPosition(position);

        const artworkRead = await artworkService.readArtwork(login, position);

        res.status(200).json({ artworkRead, message:'Artwork read successfully' });
        console.log("Artwork read by:",login);

		const cookie_config = cookieConfig(req)
        artworkService.event('ArtworkRead', { login, position, artwork: artworkRead, cookie_config });
    }
    catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
}

export const update_artwork = async (req: Request, res: Response) => {
    try{
        if(!req.session.login_cookie){
            return res.status(401).json({ message: 'User not logged in' });
        }
        const login = req.session.login_cookie;
        checkStr(login, 'login');

        const artwork:IArtwork = req.body.artwork;
        checkArtwork(artwork);

        const position = Number(req.params.position);
        checkPosition(position);

        const artworkUpdated = await artworkService.updateArtwork(login, position, artwork);

        res.status(200).json({ artworkUpdated, message:'Artwork updated successfully' });
        console.log("Artwork updated by:",login)

		const cookie_config = cookieConfig(req)
        artworkService.event('ArtworkUpdated', {login, position, artwork: artworkUpdated, cookie_config});
    }
    catch (err) {
        res.status(400).json({ message: (err as Error).message });
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
        checkStr(artwork.title, 'title');

        if(!artwork.hasOwnProperty('description')){throw new MissingParameters('description');}
        if(typeof artwork.description !== 'string'){throw new WrongTypeParameters('description');}

        if(!artwork.hasOwnProperty('counters')){throw new MissingParameters('counters');}
        if(typeof  artwork.counters !== 'object'){throw new WrongTypeParameters('counters');}
        else{
            artwork.counters.forEach(counter => {
                if(!counter.hasOwnProperty('name')){throw new MissingParameters('counter_name');}
                checkStr(counter.name, 'counter_name');

                if(!counter.hasOwnProperty('value')){throw new MissingParameters('counter_value');}
                if(isNaN(counter.value) || !Number.isInteger(counter.value)){throw new WrongTypeParameters('counter_value');}
                if(counter.value < 0 || counter.value > counter.maxValue){throw new Invalid('counter_value');}

                if(!counter.hasOwnProperty('maxValue')){throw new MissingParameters('counter_maxvalue');}
                if(isNaN(counter.maxValue) || !Number.isInteger(counter.maxValue)){throw new WrongTypeParameters('counter_maxvalue');}
                if(counter.maxValue < 0){throw new Invalid('counter_maxvalue');}
            });
        }

        if(!artwork.hasOwnProperty('tags')){throw new MissingParameters('tags');}
        if(typeof artwork.tags !== 'object'){throw new WrongTypeParameters('tags');}
        artwork.tags.forEach(tag => {
            if(typeof tag !== 'string'){throw new WrongTypeParameters('tag');}
            if(tag.trim() === "" || tag.length > 20){throw new Invalid('tag');}
        });

        if(!artwork.hasOwnProperty('informations')){throw new MissingParameters('informations');}
        if(typeof artwork.informations !== 'object'){throw new WrongTypeParameters('informations');}
        artwork.informations.forEach(info => {
            if(!info.hasOwnProperty('name')){throw new MissingParameters('info_name');}
            checkStr(info.name, 'info_name');

            if(!info.hasOwnProperty('content')){throw new MissingParameters('info_content');}
            checkStr(info.content, 'info_content');
        });
        if(!artwork.hasOwnProperty('img')){throw new MissingParameters('image');}
    }
}

const checkPosition = (position: number) => {
    if(!position && position != 0){throw new MissingParameters('position');}
    if(isNaN(position) || !Number.isInteger(position)) {throw new WrongTypeParameters('position');}
    if(position < 0) {throw new Invalid('position');}
}

const cookieConfig = (req:Request) => {
	const login:string = req.session.login_cookie as string
	const session:string = req.sessionID
	const _expires:Date=req.session.cookie.expires as Date
	// console.log("expires:",_expires)
	const maxAge:number = req.session.cookie.originalMaxAge as number
	const cookieConfig = {login, session, _expires, maxAge}
	return cookieConfig
}
