import express from 'express';
import * as authService from '../services/authService';
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
        res.status(200).send({ message: 'Event received'});
    }catch(err){
        res.status(400).json({ message: (err as Error).message });
    }
});

const UpdateCookie = (req: Request, res: Response) => {
    try {
        const { cookie_config } = req.body.payload;
        authService.updateCookie(cookie_config);
        }catch(err){
            console.log(err);
        }
};

const funcoes = {
    UserRegistered:(req: Request, res:Response)=>{
        try{
            const {login,password} = req.body.payload;
            authService.startUser(login,password);
        }catch(err){
            console.log((err as Error).message);
        }
    },
    ArtworkCreated: UpdateCookie,
    ArtworkRead: UpdateCookie,
    ArtworkUpdated: UpdateCookie
}