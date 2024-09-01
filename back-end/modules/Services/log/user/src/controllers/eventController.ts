import express from 'express';
import {Request, Response} from 'express';
import * as userService from '../services/userService';
import { ICookieConfig } from '../models/sessions';
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

const UpdateSession = (req: Request, res: Response) => {
    try {
        const { cookie_config } = req.body.payload;
        userService.updateSession(cookie_config);
    }catch(err){
        console.log((err as Error).message);
    }
};

const funcoes = {
    UserLogged:UpdateSession,
    UserDisconnected: (req: Request, res: Response) => {
        try {
            const cookie_config:ICookieConfig = req.body.payload.cookie_config;
            userService.deleteSession(cookie_config.session);
            }catch(err){
                console.log((err as Error).message);
            }
    },
    ArtworkCreated: UpdateSession,
    ArtworkRead: UpdateSession,
    ArtworkUpdated: UpdateSession,
    ArtworkDeleted: UpdateSession,
    QueryArtworks: UpdateSession,
    TagsRead: UpdateSession,
    CounterUpdated: UpdateSession,
}