import express from 'express';
import { ArtworksModel } from '../models/artworks';
import { ISession, SessionModel } from '../models/sessions';
import {Request, Response} from 'express';
const app = express();

type FuncoesKeys = keyof typeof funcoes;

export const handleEvent = app.post('/event', async (req:Request, res:Response) => {
    try{
        const type: string = req.body.type
        if (type in funcoes) {
            console.log('Event received:', type);
            const functionName = type as FuncoesKeys;
            funcoes[functionName](req, res);
        }
        else{
            console.error(`Event received: ${type}, does not exist in funcoes.`);
        }
        res.status(200).send({message: 'Event received'});
    }catch(err){
        res.end();
    }
});

const funcoes = {
    UserRegistered:(req: Request, res:Response)=>{
        try{
            const {login} = req.body.payload;
            const authArtworks = new ArtworksModel({login, artworks: []});
            authArtworks.save();
            console.log(authArtworks)
            res.status(200);
        }catch(err){
            console.error((err as any).message);
        }
    },
    UserLogged:(req: Request, res:Response)=>{
        try{
            const {login, session, _expires} = req.body.payload;
            const expires:Date = new Date(_expires);
            const newSession : ISession ={
                "_id": session,
                "expires": expires,
                "session":`{"cookie":{"originalMaxAge":300000,"expires":"${expires.toISOString()}","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"login_cookie":"${login}"}`
            };
            SessionModel.findOneAndUpdate({ _id: session }, newSession, { upsert: true }).
            catch(err => console.error(err.message));
            res.status(200);
        }catch(err){
            console.error((err as any).message);
        }
    }
}