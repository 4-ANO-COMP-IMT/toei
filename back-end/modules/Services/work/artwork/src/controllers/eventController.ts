import express from 'express';
import {Request, Response} from 'express';
import * as artworkService from '../services/artworkService';
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
        console.log((err as Error).message);
    }
});

const funcoes = {
    UserLogged:(req: Request, res:Response)=>{
        try{
            const {cookie_config} = req.body.payload;
            artworkService.updateCookie(cookie_config);
        }catch(err){
            console.log((err as Error).message);
        }
    }
}