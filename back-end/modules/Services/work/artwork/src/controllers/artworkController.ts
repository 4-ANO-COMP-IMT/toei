import { Request, Response } from 'express';
import * as artworkService from '../services/artworkService';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';
import { IArtwork } from '../models/artworks';
import { ICookieConfig } from '../models/sessions';

declare module 'express-session' {
    interface SessionData {
        login_cookie: string;
        ip_cookie: string;
    }
}

export const create_artwork = async (req: Request, res: Response) => {
    try {
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ created:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;
        const artwork:IArtwork = req.body.artwork;
        checkArtwork(artwork);

        const artworkCreated = await artworkService.createArtwork(login, artwork);

        res.status(201).json({ created:true, artworkCreated, message:'Artwork created successfully' });
        console.log("Artwork created by:",login);

		const cookie_config = cookieConfig(req)
        artworkService.event('ArtworkCreated', {artworkCreated, cookie_config});
    } catch (err) {
        res.status(400).json({ created:false, message: (err as Error).message });
    }
}

export const read_artwork = async (req: Request, res: Response) => {
    try{
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ read:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie as string;
        const id = req.params.id;
        checkStr(id, 'id');

        const artworkRead = await artworkService.readArtwork(login, id);
        if(!artworkRead || artworkRead.length === 0){
            return res.status(404).json({ read:false, message: 'Artwork not found' });
        }
        res.status(200).json({ read:true, artworkRead, message:'Artwork read successfully' });
        console.log("Artwork read by:",login);

		const cookie_config = cookieConfig(req)
        artworkService.event('ArtworkRead', {artworkRead, cookie_config});
    }
    catch (err) {
        res.status(400).json({ read:false, message: (err as Error).message });
    }
}

export const update_artwork = async (req: Request, res: Response) => {
    try{
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({  updated:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;

        const id = req.params.id;
        checkStr(id, 'id');

        const artwork:IArtwork = req.body.artwork;
        checkArtwork(artwork);

        const artworkUpdated = await artworkService.updateArtwork(login, id, artwork);
        if(!artworkUpdated || artworkUpdated.modifiedCount === 0){
            return res.status(404).json({  updated:false, message: 'Artwork not found' });
        }

        res.status(200).json({ updated:true, artworkUpdated, message:'Artwork updated successfully' });
        console.log("Artwork updated by:",login)

		const cookie_config = cookieConfig(req)
        artworkService.event('ArtworkUpdated', {artworkUpdated:artwork, cookie_config});
    }
    catch (err) {
        res.status(400).json({ updated:false, message: (err as Error).message });
    }
}

export const delete_artwork = async (req: Request, res: Response) => {
    try{
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ deleted:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;
        const id = req.params.id;
        checkStr(id, 'id');

        const artworkDeleted = await artworkService.deleteArtwork(login, id);
        if(!artworkDeleted || artworkDeleted.deletedCount === 0){
            return res.status(404).json({ deleted:false, message: 'Artwork not found' });
        }

        res.status(200).json({ deleted:true, artworkDeleted, message:'Artwork deleted successfully' });
        console.log("Artwork deleted by:",login);

        const cookie_config = cookieConfig(req)
        artworkService.event('ArtworkDeleted', {login, id, cookie_config});
    }
    catch (err) {
        res.status(400).json({ deleted:false, message: (err as Error).message });
    }
}

const cookieConfig = (req:Request) => {
	const login:string = req.session.login_cookie as string
	const session:string = req.sessionID
	const _expires:Date=req.session.cookie.expires as Date
	const maxAge:number = req.session.cookie.originalMaxAge as number
    const ip_cookie:string = req.session.ip_cookie as string

	const cookieConfig:ICookieConfig = {login, session, _expires, maxAge, ip_cookie}
	return cookieConfig
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
        checkStr(artwork.description, 'description');

        if(!artwork.hasOwnProperty('counters')){throw new MissingParameters('counters');}
        if(!Array.isArray(artwork.counters)){throw new WrongTypeParameters('counters');}
        if(artwork.counters.length === 0){throw new MissingParameters('counters');}
        if(typeof artwork.counters !== 'object'){throw new WrongTypeParameters('counters');}
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
        if(!Array.isArray(artwork.tags)){throw new WrongTypeParameters('tags');}
        if(artwork.tags.length === 0){throw new MissingParameters('tags');}
        artwork.tags.forEach(tag => {
            if(typeof tag !== 'string'){throw new WrongTypeParameters('tag');}
            if(tag.trim() === "" || tag.length > 20){throw new Invalid('tag');}
        });

        if(!artwork.hasOwnProperty('informations')){throw new MissingParameters('informations');}
        if(typeof artwork.informations !== 'object'){throw new WrongTypeParameters('informations');}
        if(!Array.isArray(artwork.informations)){throw new WrongTypeParameters('informations');}
        if(artwork.informations.length === 0){throw new MissingParameters('informations');}
        artwork.informations.forEach(info => {
            if(!info.hasOwnProperty('name')){throw new MissingParameters('info_name');}
            checkStr(info.name, 'info_name');
            if(!info.hasOwnProperty('content')){throw new MissingParameters('info_content');}
            if (typeof info.content !== 'string') {throw new WrongTypeParameters('info_content');}
        });
        if(!artwork.hasOwnProperty('img')){throw new MissingParameters('image');}
        checkStr(artwork.img, 'image');
    }
}