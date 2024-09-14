import express from 'express';
import {Request, Response} from 'express';
import * as counterService from '../services/counterService';
const app = express();
import { ICookieConfig } from '../models/sessions';
import { IUserChanges } from '../models/events';

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
        counterService.updateCookie(cookie_config);
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
            counterService.updateArtworks(userChanges);

            UpdateSession(req,res);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    UserDeleted: (req: Request, res: Response) => {
        try {
            const cookie_config:ICookieConfig = req.body.payload.cookie_config;
            console.log(cookie_config)
            counterService.deleteArtworks(cookie_config.login);
            counterService.deleteSessions(cookie_config.login);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    UserLogged:UpdateSession,
    UserDisconnected: (req: Request, res: Response) => {
        try {
            const cookie_config:ICookieConfig = req.body.payload.cookie_config;
            counterService.deleteSession(cookie_config.session);
            }catch(err){
                console.log((err as Error).message);
            }
    },
    ArtworkCreated: (req: Request, res: Response) => {
        try {
            const artworkCreated = req.body.payload.artworkCreated;
            const artwork = artworkCreated.artwork;
            const {counters,...removeArtwork} = artwork;
            const login = artworkCreated.login;
            const id = artworkCreated['_id'];
            counterService.createArtwork(id, login, {counters});
            UpdateSession(req,res);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    ArtworkRead: UpdateSession,
    ArtworkUpdated: (req: Request, res: Response) => {
        try {
            const artworkUpdated = req.body.payload.artworkUpdated;
            const artwork = artworkUpdated;
            const {counters,...removeArtwork} = artwork;
            const login = artworkUpdated.login;
            const id = artworkUpdated['_id'];
            counterService.updateArtwork(id, login,{counters});
            UpdateSession(req,res);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    ArtworkDeleted: (req: Request, res: Response) => {
        try {
            const {login,id} = req.body.payload;
            counterService.deleteArtwork(login, id);
            UpdateSession(req,res);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    QueryArtworks: UpdateSession,
    TagsRead: UpdateSession,
}