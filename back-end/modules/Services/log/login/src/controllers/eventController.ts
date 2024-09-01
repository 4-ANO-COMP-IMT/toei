import express from 'express';
import * as authService from '../services/authService';
import {Request, Response} from 'express';
import { IUserChanges } from '../models/events';
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
        res.status(200).send({ message: 'Event received'});
    }catch(err){
        res.status(400).json({ message: (err as Error).message });
    }
});

const UpdateSession = (req: Request, res: Response) => {
    try {
        const { cookie_config } = req.body.payload;
        authService.updateSession(cookie_config);
    }catch(err){
        console.log((err as Error).message);
    }
};

const funcoes = {
    UserCreated:(req: Request, res:Response)=>{
        try{
            const {login,password} = req.body.payload;
            authService.createLogin(login,password);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    UserRead: UpdateSession,
    UserUpdated: (req: Request, res: Response) => {
        try {
            const userChanges:IUserChanges = req.body.payload.userChanges;
            authService.updateLogin(userChanges);
            UpdateSession(req,res);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    UserDeleted: (req: Request, res: Response) => {
        try {
            const cookie_config:ICookieConfig = req.body.payload.cookie_config;
            authService.deleteLogin(cookie_config.login);
            authService.deleteSessions(cookie_config.login);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    UserDisconnected: (req: Request, res: Response) => {
        try {
            const cookie_config:ICookieConfig = req.body.payload.cookie_config;
            authService.deleteSession(cookie_config.session);
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