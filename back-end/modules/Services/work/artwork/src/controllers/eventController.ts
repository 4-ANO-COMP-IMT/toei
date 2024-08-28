import express from 'express';
import {Request, Response} from 'express';
import * as artworkService from '../services/artworkService';
const app = express();
import { IUserChanges } from '../models/events';
import { ICookieConfig } from '../models/sessions';

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
        artworkService.updateSession(cookie_config);
    }catch(err){
        console.log((err as Error).message);
    }
};

const funcoes = {
    // UserCreated não afeta este mss
    UserRead: UpdateSession,
    UserUpdated: (req: Request, res: Response) => {
        try {
            const userChanges:IUserChanges = req.body.payload.userChanges;
            artworkService.updateArtworks(userChanges);
            UpdateSession(req,res);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    UserDeleted: (req: Request, res: Response) => {
        try {
            const cookie_config:ICookieConfig = req.body.payload.cookie_config;
            artworkService.deleteArtworks(cookie_config.login);
            artworkService.deleteSessions(cookie_config.login);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    UserLogged:UpdateSession,
    UserDisconnected: (req: Request, res: Response) => {
        try {
            const cookie_config:ICookieConfig = req.body.payload.cookie_config;
            artworkService.deleteSession(cookie_config.session);
            }catch(err){
                console.log((err as Error).message);
            }
    },
    QueryArtworks: UpdateSession,
    TagsRead: UpdateSession,
}