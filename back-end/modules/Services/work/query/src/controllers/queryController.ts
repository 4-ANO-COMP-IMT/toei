import { Request, Response } from 'express';
import * as queryService from '../services/queryService';
import {IFilters} from '../models/artworks';
import { ICookieConfig } from '../models/sessions';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';

declare module 'express-session' {
    interface SessionData {
        login_cookie: string;
        ip_cookie: string;
    }
}

export const query_artworks = async (req: Request, res: Response) => {
    try {
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ created:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;

        const {title, tags, filters,sort,order}:IFilters = req.body;
        checkFilters(title, tags, filters,sort,order);

        const artworks = await queryService.readArtworks(login,title,tags,filters,sort,order);
        res.status(200).json({ read:true, artworks, message:'Artworks read successfully' });
        
		const cookie_config = cookieConfig(req)
        queryService.event('ArtworksRead', {cookie_config});
    } catch (error) {
        res.status(500).send(error);
    }
}

export const read_tags = async (req: Request, res: Response) => {
    try {
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ created:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;
        const tags = await queryService.readTags(login);
        console.log("Tags read by:",login);
        res.status(200).json({ read:true, tags, message:'Tags read successfully' });
        
		const cookie_config = cookieConfig(req)
        queryService.event('TagsRead', {cookie_config});
    } catch (error) {
        res.status(500).send(error);
    }
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

const checkStr = (input: string, name: string) => {
    if (!input) {throw new MissingParameters(name);}
    if (typeof input !== 'string') {throw new WrongTypeParameters(name);}
    if (input.trim() === "") {throw new Invalid(name);} 
}

const checkFilters = (title:string, tags:string[], filters:string[],sort:string,order:boolean) => {
    // check i title exists and is a string and it could be ""
    if (!title && title.trim()!="") {throw new MissingParameters('title');}
    if (typeof title !== 'string') {throw new WrongTypeParameters('title');}

    if(!tags){throw new MissingParameters('tags');}
    if(typeof tags !== 'object'){throw new WrongTypeParameters('tags');}
    tags.forEach(tag => {checkStr(tag, 'tags_tag');})

    if(!filters){throw new MissingParameters('filters');}
    if(typeof filters !== 'object'){throw new WrongTypeParameters('filters');}
    filters.forEach(filter => {checkStr(filter, 'filters_filter');})

    checkStr(sort, 'sort');

    if(order===undefined){throw new MissingParameters('order');}
    if(typeof order !== 'boolean'){throw new WrongTypeParameters('order');}
}
