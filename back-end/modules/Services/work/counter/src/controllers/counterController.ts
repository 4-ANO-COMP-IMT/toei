import { Request, Response } from 'express';
import * as counterService from '../services/counterService';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';
import { IArtworks } from '../models/counter';
import { ICookieConfig } from '../models/sessions';

declare module 'express-session' {
    interface SessionData {
        login_cookie: string;
        ip_cookie: string;
    }
}

export const counter_update = async (req: Request, res: Response) => {
    try {
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            console.log(req.session)
            return res.status(401).json({ updated:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;
        const id = req.params.id;
        checkStr(id, 'id');
        const { position, value }:{ id:string,position:number,value:number} = req.body;
        checkNum(position, 'position');
        checkNum(value, 'value');
        
        const art = await counterService.getMaxValue(id, position);
        if(!art){
            return res.status(400).json({updated:false, message: 'Counter not found'});
        }

        const artworkSelected:IArtworks = art;

        if (!artworkSelected.artwork.counters[position]){
            return res.status(400).json({updated:false, message: 'Counter not found'});
        }
        if(value == artworkSelected.artwork.counters[position].value){
            return res.status(400).json({updated:false, message: 'Value is the same'});
        }
        if(value > artworkSelected.artwork.counters[position].maxValue){
            return res.status(400).json({updated:false, message: 'Value greater than max value'});
        }
        const result = await counterService.updateCounter(login, id, position, value);
        res.status(200).send({updated:true,result, message:'Counter updated successfully'});
        console.log("Counter updated by:", login);

        const cookie_config = cookieConfig(req)
        counterService.event('CounterUpdated',{counterUpdated:{login, id, position, value}, cookie_config});
    } catch (err
    ) {
        res.status(400).send({updated:false, message: (err as Error).message });
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

const checkStr = (input: string, name: string) => {
    if (!input) {throw new MissingParameters(name);}
    if (typeof input !== 'string') {throw new WrongTypeParameters(name);}
    if (input.trim() === "") {throw new Invalid(name);} 
}

const checkNum = (input: number, name: string) => {
    if (!input && input!=0) {throw new MissingParameters(name);}
    if (isNaN(input)) {throw new WrongTypeParameters(name);}
    if (input < 0) {throw new Invalid(name);}
}